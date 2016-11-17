/// <reference path="../../business_logic/MotionModel.ts" />
/// <reference path="./FrameFactory.ts" />

angular.module(APP_NAME).service("SharedMotionService",
    [
        "$rootScope",
        "FrameFactory",
        MotionModel
    ]
);