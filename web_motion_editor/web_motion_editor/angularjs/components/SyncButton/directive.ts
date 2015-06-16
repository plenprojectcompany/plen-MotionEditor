/// <reference path="./controller.ts" />

function SyncButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: SyncButtonController,
        controllerAs: "sync_button",
        scope: {},
        templateUrl: "./angularjs/components/SyncButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("syncButton", SyncButtonDirective);