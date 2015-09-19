/// <reference path="./controller.ts" />

class SyncButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: SyncButtonController,
            controllerAs: "sync_button",
            scope: {},
            templateUrl: "./angularjs/components/SyncButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("syncButton",
    [
        SyncButtonDirective.getDDO
    ]
);