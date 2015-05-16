/// <reference path="./controller.ts" />

function NewButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: NewButtonController,
        controllerAs: "new_button",
        scope: {},
        templateUrl: "./angularjs/components/NewButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("newButton", NewButtonDirective);  