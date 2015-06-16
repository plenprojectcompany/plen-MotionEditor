/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class PreviousButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "$rootScope"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("AnimationPrevious");
    }
} 