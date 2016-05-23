/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class SyncButtonController
{
    disabled: boolean = false;
    syncing: boolean = false;

    static $inject = [
        "$scope",
        "$rootScope",
        "PLENControlServerService"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public plen_controll_server_service: PLENControlServerService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });

        $scope.$on("SyncEnd", () => { this.syncing = false; });
    }

    onClick(): void
    {
        var success_callback = () =>
        {
            this.syncing = true;
            this.$rootScope.$broadcast("SyncBegin");
        };

        if (!this.syncing)
        {
            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.DISCONNECTED)
            {
                this.plen_controll_server_service.connect(success_callback);
            }

            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
            {
                success_callback();
            }
        }
        else
        {
            this.$rootScope.$broadcast("SyncEnd");
        }
    }
}