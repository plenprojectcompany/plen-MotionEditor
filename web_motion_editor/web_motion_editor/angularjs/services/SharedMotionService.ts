/// <reference path="../../business_logic/MotionModel.ts" />
/// <reference path="./FrameFactory.ts" />

"use strict";

angular.module(app_name).service("SharedMotionService",
    [
        "$rootScope",
        "FrameFactory",
        MotionModel
    ]
);