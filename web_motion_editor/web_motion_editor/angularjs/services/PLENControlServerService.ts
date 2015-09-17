enum SERVER_STATE
{
    DISCONNECTED,
    CONNECTED,
    WAITING
};

class PLENControlServerService
{
    private _state: SERVER_STATE = SERVER_STATE.DISCONNECTED;
    private _ip_addr: string;
    private _syncing: boolean = false;

    static $inject = [
        "$http",
        "$modal",
        "$rootScope",
        "SharedMotionService"
    ];

    constructor(
        public $http: ng.IHttpService,
        public $modal: angular.ui.bootstrap.IModalService,
        public $rootScope: ng.IRootScopeService,
        public motion: MotionModel
    )
    {
        this.$rootScope.$on("SyncBegin", () => { this.onSyncBegin(); });
        this.$rootScope.$on("SyncEnd", () => { this.onSyncEnd(); });
    }

    connect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.DISCONNECTED)
        {
            var modal = this.$modal.open({
                controller: PLENControlServerModalController,
                controllerAs: "modal",
                templateUrl: "./angularjs/components/PLENControlServerModal/view.html"
            });

            modal.result.then((ip_addr: string) =>
            {
                this._state = SERVER_STATE.WAITING;
                this._ip_addr = ip_addr;

                this.$http.jsonp("http://" + this._ip_addr + "/connect/?callback=JSON_CALLBACK")
                    .success((response: any) =>
                    {
                        if (response.result === true)
                        {
                            this._state = SERVER_STATE.CONNECTED;

                            if (!_.isNull(success_callback))
                            {
                                success_callback();
                            }
                        }
                        else
                        {
                            this._state = SERVER_STATE.DISCONNECTED;
                        }
                    })
                    .error(() =>
                    {
                        this._state = SERVER_STATE.DISCONNECTED;
                    });
            });
        }
    }

    install(json, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.post("http://" + this._ip_addr + "/install/", json)
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                })
                .finally(() =>
                {
                    this.$rootScope.$broadcast("InstallFinished");
                });
        }
    }

    play(slot: number, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.jsonp("http://" + this._ip_addr + "/play/" + slot.toString() + "/?callback=JSON_CALLBACK")
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                });
        }
    }

    getStatus(): SERVER_STATE
    {
        return this._state;
    }

    onSyncBegin(): void
    {
        this._syncing = true;
    }

    onSyncEnd(): void
    {
        this._syncing = false;
    }
}

angular.module(app_name).service("PLENControlServerService", PLENControlServerService);