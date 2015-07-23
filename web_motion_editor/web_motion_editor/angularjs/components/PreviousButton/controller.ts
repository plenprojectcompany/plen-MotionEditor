/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class PreviousButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "SharedMotionService",
        "$rootScope"
    ];

    constructor(
        $scope: ng.IScope,
        public motion_model: MotionModel,
        public $rootScope: ng.IRootScopeService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.$rootScope.$broadcast("AnimationPrevious");
    }
} 