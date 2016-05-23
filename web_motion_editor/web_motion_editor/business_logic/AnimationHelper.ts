/// <reference path="./MotionModel.ts" />
/// <reference path="./ThreeModel.ts" />
/// <reference path="../angularjs/services/SharedMotionService.ts" />
/// <reference path="../angularjs/services/SharedThreeService.ts" />

class AnimationHelper
{
    static $inject = [
        "$rootScope",
        "$interval",
        "SharedMotionService"
    ];

    static FPS: number = 30;

    private _outputs_backup: Array<number> = [];
    private _angle_diffs: Array<number>    = [];
    private _animation_promise: any;

    constructor(
        public $rootScope: ng.IRootScopeService,
        public $interval: ng.IIntervalService,
        public motion: MotionModel
    )
    {
        $rootScope.$on("AnimationPlay", () => { this.onAnimationPlay(); });
        $rootScope.$on("AnimationStop", () => { this.onAnimationStop(); });

        $rootScope.$on("AnimationPrevious", () =>
        {
            var now_frame_index = this.motion.getSelectedFrameIndex();

            if (now_frame_index !== 0)
            {
                this.onAnimationPlayOnce(now_frame_index - 1);
            }
            else
            {
                $rootScope.$broadcast("ComponentEnabled");
            }
        });

        $rootScope.$on("AnimationNext", () =>
        {
            var now_frame_index = this.motion.getSelectedFrameIndex();

            if (now_frame_index !== (this.motion.frames.length - 1))
            {
                this.onAnimationPlayOnce(now_frame_index + 1);
            }
            else
            {
                $rootScope.$broadcast("ComponentEnabled");
            }
        });
    }

    onAnimationPlayOnce(next_frame_index: number, continuous_callback: any = null): void
    {
        var now_frame_index = this.motion.getSelectedFrameIndex();

        var now_frame  = this.motion.frames[now_frame_index];
        var next_frame = this.motion.frames[next_frame_index];

        var transition_count = Math.ceil(next_frame.transition_time_ms / (1000 / AnimationHelper.FPS));

        this._outputs_backup = [];
        this._angle_diffs    = [];
        _.each(now_frame.outputs, (output: OutputDeviceModel, index: number) =>
        {
            this._outputs_backup.push(output.value);
            this._angle_diffs.push((next_frame.outputs[index].value - output.value) / transition_count);
        });

        this._animation_promise = this.$interval(() =>
        {
            _.each(this._angle_diffs, (angle_diff: number, index: number) =>
            {
                now_frame.outputs[index].value += angle_diff;
            });

            this.$rootScope.$broadcast("FrameLoad", now_frame_index);
        }, (1000 / AnimationHelper.FPS), transition_count);

        this._animation_promise.catch(() =>
        {
            continuous_callback = null;
        });

        this._animation_promise.finally(() =>
        {
            _.each(now_frame.outputs, (output: OutputDeviceModel, index: number) =>
            {
                output.value = this._outputs_backup[index];
            });

            this.motion.selectFrame(next_frame_index, false, false);

            if (continuous_callback === null)
            {
                this.$rootScope.$broadcast("ComponentEnabled");
            }
            else
            {
                continuous_callback();
            }
        });
    }

    onAnimationPlay(): void
    {
        var use_loop: boolean      = false;
        var loop_begin: number     = null;
        var loop_end: number       = null;
        var loop_count: number     = null;
        var loop_infinity: boolean = false;

        _.each(this.motion.codes, (code: CodeModel) =>
        {
            if (code.func === "loop")
            {
                use_loop   = true;
                loop_begin = code.args[0];
                loop_end   = code.args[1];
                loop_count = code.args[2];


                if (loop_count === 255)
                {
                    loop_infinity = true;
                }

                return false;
            }
        });

        var callback = () =>
        {
            var now_frame_index = this.motion.getSelectedFrameIndex();

            if (use_loop && (now_frame_index === loop_end))
            {
                if ((loop_count > 0) || loop_infinity)
                {
                    loop_count--;
                    this.onAnimationPlayOnce(loop_begin, callback);

                    return;
                }
            }

            if (now_frame_index !== (this.motion.frames.length - 1))
            {
                this.onAnimationPlayOnce(now_frame_index + 1, callback);
            }
            else
            {
                this.$rootScope.$broadcast("ComponentEnabled");
            }
        };

        if (this.motion.getSelectedFrameIndex() !== 0)
        {
            this.onAnimationPlayOnce(0, callback);
        }
        else if (this.motion.frames.length > 1)
        {
            this.onAnimationPlayOnce(1, callback);
        }
        else
        {
            this.$rootScope.$broadcast("ComponentEnabled");
        }
    }

    onAnimationStop(): void
    {
        this.$interval.cancel(this._animation_promise);
    }
}