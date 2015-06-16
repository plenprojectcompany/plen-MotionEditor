/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class NextButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$rootScope",
        "$scope"
    ];

    constructor(
        public $rootScope: ng.IRootScopeService,
        $scope: ng.IScope
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("AnimationNext");
    }
}  