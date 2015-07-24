/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

"use strict";

class InstallButtonController
{
    disabled: boolean = false;
    installing: boolean = false;

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
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
        $scope.$on("InstallFinished", () => { this.installing = false; });
    }

    onClick(): void
    {
        if (this.plen_controll_server_service.getStatus() === SERVER_STATE.DISCONNECTED)
        {
            this.plen_controll_server_service.connect();
        }

        if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
        {
            var success_callback = () =>
            {
                this.plen_controll_server_service.play(this.motion.slot, () =>
                {
                    this.$rootScope.$broadcast("AnimationPlay");
                });
            };

            this.$rootScope.$broadcast("FrameSave", this.motion.getSelectedFrameIndex());
            this.plen_controll_server_service.install(JSON.parse(this.motion.saveJSON()), success_callback);
            this.installing = true;
        }
    }
} 