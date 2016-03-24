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

                this.$http.get("//" + this._ip_addr + "/v2/connect")
                    .success((response: any) =>
                    {
                        if (response.data.result === true)
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

                            alert("USB connection was disconnected!");
                        }
                    })
                    .error(() =>
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        // alert("Your control-server's version is old. Please use latest version.");
                    });
            });
        }
    }

    disconnect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/v2/disconnect")
                .success((response: any) =>
                {
                    if (response.data.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }

                    this._state = SERVER_STATE.DISCONNECTED;

                    alert("USB connection was disconnected!");
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.CONNECTED;
                });
        }
    }

    install(json, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.put("//" + this._ip_addr + "/v2/motions/" + json.slot.toString(), json)
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.data.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                    else
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        alert("USB connection was disconnected!");
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

            this.$http.get("//" + this._ip_addr + "/v2/motions/" + slot.toString() + "/play")
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.data.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                    else
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        alert("USB connection was disconnected!");
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                });
        }
    }

    stop(success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/v2/motions/stop")
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.data.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                    else
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        alert("USB connection was disconnected!");
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

angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);