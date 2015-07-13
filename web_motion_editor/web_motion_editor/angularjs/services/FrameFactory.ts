/// <reference path="./ImageStoreService.ts" />
/// <reference path="../../business_logic/FrameModel.ts" />

"use strict";

class FrameFactory
{
    static $inject = ["ImageStoreService"];

    constructor(
        public image_store_service: ImageStoreService
    )
    {
        // noop.
    }

    getFrame(selected: boolean = true): FrameModel
    {
        return new FrameModel(
            500,
            [],
            selected,
            this.image_store_service.get()
        );
    }
}

angular.module(app_name).service("FrameFactory", FrameFactory); 