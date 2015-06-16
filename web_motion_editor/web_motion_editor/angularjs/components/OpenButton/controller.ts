/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class OpenButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "SharedMotionService"
    ];

    constructor(
        $scope: ng.IScope,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }
} 