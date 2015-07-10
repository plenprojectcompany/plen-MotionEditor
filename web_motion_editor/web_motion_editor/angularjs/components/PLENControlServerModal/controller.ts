/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

"use strict";

class ModalController
{
    ip_addr: string = "";

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
            alert("IPアドレスの形式が不正です。");
        }
    }

    cancel(): void
    {
        this.$modalInstance.dismiss();
    }
} 