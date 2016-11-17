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
        if (!this.syncing)
        {
            if (this.plen_controll_server_service.getStatus() === SERVER_STATE.DISCONNECTED)
            {
                this.plen_controll_server_service.connect(() =>
                {
                    var promise: ng.IPromise<any> = this.plen_controll_server_service.asyncCheckVersionOfPLEN();

                    promise.finally(() =>
                    {
                        if (this.plen_controll_server_service.getStatus() === SERVER_STATE.CONNECTED)
                        {
                            this.syncing = true;
                            this.$rootScope.$broadcast("SyncBegin");
                        }
                    });
                });
            }
        }
        else
        {
            this.$rootScope.$broadcast("SyncEnd");
            
            this.plen_controll_server_service.disconnect();
        }
    }
}