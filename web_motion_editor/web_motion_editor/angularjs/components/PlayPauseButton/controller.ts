class PlayPauseButtonController
{
    "use strict";

    playing: boolean = false;
    title: string = "Play a motion.";

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
        $scope.$on("ComponentDisabled",() => { this.playing = true; });
        $scope.$on("ComponentEnabled",() => { this.playing = false; });
    }

    onClick(): void
    {
        if (this.playing === false)
        {
            this.$rootScope.$broadcast("ComponentDisabled");
            this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
            this.motion_model.selectFrame(0);
            this.$rootScope.$broadcast("AnimationPlay");

            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
            {
                this.plen_controll_server_service.play(this.motion_model.slot);
            }

            this.title = "Pause a motion.";
        }
        else
        {
            this.$rootScope.$broadcast("AnimationStop");
            this.title = "Play a motion.";
        }
    }
}   