class PlayPauseButtonController
{
    playing: boolean = false;
    installing: boolean = false;
    title: string = "Play a motion.";

    static $inject = [
        "PLENControlServerService",
        "$scope",
        "$rootScope",
        "SharedMotionService"
    ];

    constructor(
        public plen_controll_server_service: PLENControlServerService,
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.playing = true; this.title = "Pause a motion."; });
        $scope.$on("ComponentEnabled", () => { this.playing = false; this.title = "Play a motion."; });
        $scope.$on("InstallFinished", () => { this.installing = false; });
    }

    onClick(): void
    {
        if (this.playing === false)
        {
            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
            {
                var success_callback = () =>
                {
                    this.plen_controll_server_service.play(this.motion.slot, () =>
                    {
                        this.$rootScope.$broadcast("ComponentDisabled");
                        this.$rootScope.$broadcast("AnimationPlay");

                        this.plen_controll_server_service.play(this.motion.slot);
                    });
                };

                this.$rootScope.$broadcast("FrameSave", this.motion.getSelectedFrameIndex());
                this.plen_controll_server_service.install(JSON.parse(this.motion.saveJSON()), success_callback);
                this.installing = true;

                return;
            }

            this.$rootScope.$broadcast("ComponentDisabled");
            this.$rootScope.$broadcast("FrameSave", this.motion.getSelectedFrameIndex());
            this.$rootScope.$broadcast("AnimationPlay");
        }
        else if (!this.installing)
        {
            this.$rootScope.$broadcast("AnimationStop");

            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
            {
                this.plen_controll_server_service.stop();
            }
        }
    }
} 