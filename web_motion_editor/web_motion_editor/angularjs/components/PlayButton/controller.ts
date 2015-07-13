"use strict";

class PlayButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "$rootScope",
        "SharedMotionService",
        "PLENControlServerService"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public motion_model: MotionModel,
        public plen_controll_server_service: PLENControlServerService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.motion_model.selectFrame(0);
        this.$rootScope.$broadcast("AnimationPlay");
        
        if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
        {
            this.plen_controll_server_service.play(this.motion_model.slot);
        }
    }
}  