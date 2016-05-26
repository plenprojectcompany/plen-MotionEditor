/// <reference path="../../services/SharedMotionService.ts" />

class NextButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$rootScope",
        "SharedMotionService",
        "$scope"
    ];

    constructor(
        public $rootScope: ng.IRootScopeService,
        public motion_model: MotionModel,
        $scope: ng.IScope
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.$rootScope.$broadcast("AnimationNext");
    }
}  