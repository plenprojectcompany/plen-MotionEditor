enum SERVER_STATE
{
    DISCONNECTED,
    CONNECTED,
    WAITING,
    DONE
};

class PLENControlServerService
{
    private _state: SERVER_STATE = SERVER_STATE.DISCONNECTED;

    static $inject = [

    ];

    constructor(

    )
    {
        // noop.
    }
}

angular.module(app_name).service("PLENControlServerService", PLENControlServerService);