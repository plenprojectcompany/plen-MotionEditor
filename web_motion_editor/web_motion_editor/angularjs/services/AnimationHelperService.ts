/// <reference path="../../business_logic/AnimationHelper.ts" />

angular.module(app_name).service("AnimationHelperService",
    [
        "$rootScope",
        "$interval",
        "SharedMotionService",
        AnimationHelper
    ]
);