/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class NewButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$rootScope",
        "$scope",
        "$window",
        "SharedMotionService"
    ];

    constructor(
        public $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        public $window: ng.IWindowService,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    click(): void
    {
        var result = this.$window.confirm(
            "Are you sure you want to create a new motion?\n\n" +

            "Working contents will have destroyed.\n" +
            'If your motion has not been saved yet, please click to the "Cancel" button.'
        );

        if (result === true)
        {
            this.motion.reset();
            this.$rootScope.$broadcast("3DModelReset");
        }
    }
}