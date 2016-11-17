/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class PLENControlServerModalController
{
    ip_addr: string = "127.0.0.1:17264";

    static $inject = [
        "$modalInstance"
    ];

    constructor(
        public $modalInstance: angular.ui.bootstrap.IModalServiceInstance
    )
    {
        // noop.
    }

    connect(): void
    {
        var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/;

        if (regexp.test(this.ip_addr))
        {
            this.$modalInstance.close(this.ip_addr);
        }
        else
        {
            alert("IP address has invalid format.");
        }
    }

    cancel(): void
    {
        this.$modalInstance.dismiss();
    }
} 