/// <reference path="../../services/SharedMotionService.ts" />

class FrameEditorController
{
    disabled: boolean = false;
    touch_disabled: boolean = 'ontouchend' in document;

    sortable_options = {
        axis: "x",
        scroll: false,
        revert: true
    };

    outputs_backup: Array<number> = [];
    animation_diffs: Array<number> = [];

    load_next: boolean = true;
    animation_promise: any;

    static $inject = [
        "$scope",
        "$rootScope",
        // "$q",
        "$interval",
        "SharedMotionService"
    ];

    static FPS: number = 30;

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        // public $q: ng.IQService,
        public $interval: ng.IIntervalService,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });

        $scope.$on("AnimationPlay", () => { this.onAnimationPlay(); });
        // $scope.$on("AnimationPause", () => { this.onAnimationPause(); });
        $scope.$on("AnimationStop", () => { this.onAnimationStop(); });
        $scope.$on("AnimationNext", () => { this.onAnimationPlay(false, true); });
        $scope.$on("AnimationPrevious", () => { this.onAnimationPlay(true, true); });
    }

    onAnimationPlay(reverse: boolean = false, once: boolean = false): void
    {
        var now_frame_index = this.motion.getSelectedFrameIndex();
        var now_frame = this.motion.frames[now_frame_index];

        if (reverse)
        {
            var next_frame_index = now_frame_index - 1;
            var next_frame = (now_frame_index === 0) ? null : this.motion.frames[next_frame_index];
        }
        else
        {
            var next_frame_index = now_frame_index + 1;
            var next_frame = (now_frame_index + 1 === this.motion.frames.length) ? null : this.motion.frames[next_frame_index];
        }

        if (_.isNull(next_frame))
        {
            this.$rootScope.$broadcast("ComponentEnabled");

            return;
        }

        this.load_next = !once;
        var frame_count = Math.ceil(next_frame.transition_time_ms / (1000 / FrameEditorController.FPS));

        this.outputs_backup = [];
        this.animation_diffs = [];
        _.each(now_frame.outputs, (output: OutputDeviceModel, index: number) =>
        {
            this.outputs_backup.push(output.value);

            this.animation_diffs.push(
                (next_frame.outputs[index].value - output.value) / frame_count
            );
        });

        this.animation_promise = this.$interval(() =>
        {
            _.each(this.animation_diffs, (animation_diff: number, index: number) =>
            {
                now_frame.outputs[index].value += animation_diff;
            });
            this.$rootScope.$broadcast("FrameLoad", now_frame_index);
        }, (1000 / FrameEditorController.FPS), frame_count)
        .catch(() =>
        {
            this.load_next = false;
        })
        .finally(() =>
        {
            _.each(now_frame.outputs, (output: OutputDeviceModel, index: number) =>
            {
                output.value = this.outputs_backup[index];
            });

            this.motion.selectFrame(next_frame_index, false);

            if (this.load_next)
            {
                this.onAnimationPlay(reverse);
            }
            else
            {
                this.$rootScope.$broadcast("ComponentEnabled");
            }
        });
    }

    onAnimationStop(): void
    {
        this.load_next = false;
    }

    onClick($event: any): void
    {
        if ($event.target.id === "frame_editor")
        {
            var offset_x;

            // firefox対策
            if (_.isUndefined($event.offsetX))
            {
                offset_x = $event.pageX - $($event.target).offset().left;
            }
            else
            {
                offset_x = $event.offsetX;
            }

            var insert_pos = Math.floor(offset_x / 173);

            if (insert_pos > this.motion.frames.length)
            {
                this.motion.addFrame(this.motion.frames.length);
            }
            else
            {
                this.motion.addFrame(insert_pos);
            }
        }
    }
}