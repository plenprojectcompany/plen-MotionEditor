/// <reference path="./OutputDeviceModel.ts" />

"use strict";

class FrameModel
{
    _transition_time_ms: number;
    outputs: Array<OutputDeviceModel>;
    selected: boolean;
    image_uri: string;

    constructor(
        transition_time_ms: number,
        outputs: Array<OutputDeviceModel>,
        selected: boolean,
        image_uri: string
    )
    {
        this.transition_time_ms = transition_time_ms;
        this.outputs = outputs;
        this.selected = selected;
        this.image_uri = image_uri;
    }

    set transition_time_ms(value: any)
    {
        if (_.isString(value))
        {
            this._transition_time_ms = _.parseInt(value);
        }

        if (_.isNumber(value))
        {
            this._transition_time_ms = value;
        }
    }

    get transition_time_ms()
    {
        return this._transition_time_ms;
    }

    deepCopy(frame: FrameModel): void
    {
        this.transition_time_ms = frame.transition_time_ms;
        this.selected = frame.selected;
        this.image_uri = frame.image_uri;

        this.outputs = [];

        _.each(frame.outputs, (output: OutputDeviceModel) =>
        {
            this.outputs.push(new OutputDeviceModel(output.device, output.value));
        });
    }
}