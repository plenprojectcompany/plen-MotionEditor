/// <reference path="./CodeModel.ts" />
/// <reference path="./FrameModel.ts" />

"use strict";

class MotionModel
{
    slot: number = 0;
    name: string = "Test Motion";
    codes: Array<CodeModel>   = [];
    frames: Array<FrameModel> = [];

    static MIN_FRAMES: number = 1;
    static MAX_FRAMES: number = 20;

    constructor(
        public $rootScope: ng.IRootScopeService,
        public frame_factory: FrameFactory
    )
    {
        this.frames.push(this.frame_factory.getFrame());
    }

    getSelectedFrameIndex(): number
    {
        return _.findIndex(this.frames,(frame: FrameModel) => { return frame.selected; });
    }

    removeFrame(index: number): void
    {
        if (this.frames.length !== MotionModel.MIN_FRAMES)
        {
            if (this.frames[index].selected === true)
            {
                if ((index + 1) === this.frames.length)
                {
                    this.selectFrame(index - 1);
                }
                else
                {
                    this.selectFrame(index + 1);
                }
            }

            this.frames.splice(index, 1);
        }
        else
        {
            this.reset();
        }
    }

    addFrame(index: number): void
    {
        if (this.frames.length >= MotionModel.MAX_FRAMES)
        {
            return;
        }

        var selected_frame: FrameModel = _.find(this.frames, (frame: FrameModel) =>
        {
            return frame.selected;
        });

        var copy_index = _.findIndex(this.frames, (frame: FrameModel) => { return frame.selected; });
        this.$rootScope.$broadcast("FrameSave", copy_index);

        var insertion_frame = this.frame_factory.getFrame(false);
        insertion_frame.deepCopy(selected_frame);
        insertion_frame.selected = false;

        this.frames.splice(index, 0, insertion_frame);
        this.selectFrame(index, false);
    }

    selectFrame(index: number, old_save: boolean = true): void
    {
        if (old_save)
        {
            var old_index = _.findIndex(this.frames,(frame: FrameModel) => { return frame.selected; });
            this.$rootScope.$broadcast("FrameSave", old_index);
        }

        _.each(this.frames, (frame: FrameModel) => { frame.selected = false; });
        this.frames[index].selected = true;
        this.$rootScope.$broadcast("FrameLoad", index);
    }

    selectNextFrame(): void
    {
        var index = _.findIndex(this.frames, (frame: FrameModel) => { return frame.selected; });

        if ((index + 1) !== this.frames.length)
        {
            this.selectFrame(index + 1);
        }
    }

    selectPrevFrame(): void
    {
        var index = _.findIndex(this.frames, (frame: FrameModel) =>{ return frame.selected; });

        if (index !== 0)
        {
            this.selectFrame(index - 1);
        }
    }

    reset(): void
    {
        this.frames = [this.frame_factory.getFrame()];
        this.$rootScope.$broadcast("FrameLoad", 0);
    }

    loadJSON(motion_json: string, axis_map: any): void
    {
        try {
            var motion_obj = JSON.parse(motion_json);

            if (_.isUndefined(motion_obj.slot) || !_.isNumber(motion_obj.slot))
            {
                throw "Bad format!.";
            }

            if (_.isUndefined(motion_obj.name) || !_.isString(motion_obj.name))
            {
                throw "Bad format!.";
            }

            if (_.isUndefined(motion_obj.codes) || !_.isArray(motion_obj.codes))
            {
                throw "Bad format!.";
            }

            _.each(motion_obj.codes, (code: CodeModel) =>
            {
                if (_.isUndefined(code.func) || !_.isString(code.func))
                {
                    throw "Bad format!.";
                }

                if (_.isUndefined(code.argments) || !_.isArray(code.argments))
                {
                    throw "Bad format!.";
                }
                else
                {
                    _.each(code.argments, (argment: string) =>
                    {
                        if (!_.isString(argment))
                        {
                            throw "Bad format!.";
                        }
                    });
                }
            });

            if (_.isUndefined(motion_obj.frames) || !_.isArray(motion_obj.frames))
            {
                throw "Bad format!.";
            }
            else
            {
                _.each(motion_obj.frames, (frame: FrameModel) =>
                {
                    if (_.isUndefined(frame.transition_time_ms) || !_.isNumber(frame.transition_time_ms))
                    {
                        throw "Bad format!.";
                    }

                    if (_.isUndefined(frame.outputs) || !_.isArray(frame.outputs))
                    {
                        throw "Bad format!.";
                    }
                    else
                    {
                        _.each(frame.outputs, (output: OutputDeviceModel) =>
                        {
                            if (_.isUndefined(output.device) || !_.isString(output.device))
                            {
                                throw "Bad format!.";
                            }

                            if (_.isUndefined(output.value) || !_.isNumber(output.value))
                            {
                                throw "Bad format!.";
                            }
                        });
                    }
                });
            }

            this.slot  = motion_obj.slot;
            this.name  = motion_obj.name;

            this.codes = [];
            _.each(motion_obj.codes, (code: CodeModel) =>
            {
                var argments = [];
                _.each(code.argments, (argment: string) =>
                {
                    argments.push(argment);
                });

                this.codes.push(new CodeModel(code.func, argments));
            });

            this.frames = [];
            _.each(motion_obj.frames, (frame: FrameModel) =>
            {
                var outputs = [];
                _.each(frame.outputs, (output: OutputDeviceModel) =>
                {
                    outputs[axis_map[output.device]] = new OutputDeviceModel(output.device, output.value);
                });

                this.frames.push(new FrameModel(frame.transition_time_ms, outputs, false, ""));
            });

            this.selectFrame(0, false);
        }
        catch (exception)
        {
            alert("不正なモーションファイルのため、読み込みに失敗しました。");
        }
    }

    saveJSON(): string
    {
        var motion_obj = {
            slot: this.slot,
            name: this.name,
            codes: this.codes,
            frames: []
        };

        _.each(this.frames, (frame: FrameModel) =>
        {
            var pure_frame: any = {};
            pure_frame.transition_time_ms = frame._transition_time_ms;
            pure_frame.outputs = frame.outputs;

            _.each(pure_frame.outputs, (output: OutputDeviceModel) =>
            {
                output.value = Math.round(output.value);
            });

            motion_obj.frames.push(pure_frame);
        });

        return JSON.stringify(motion_obj, null, "\t");
    }
} 