/// <reference path="../../business_logic/MotionModel.ts" />
/// <reference path="./FrameFactory.ts" />

angular.module(app_name).service("SharedMotionService",
    [
        "$rootScope",
        "FrameFactory",
        MotionModel
    ]
);