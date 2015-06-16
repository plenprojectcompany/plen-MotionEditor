/// <reference path="./controller.ts" />

function SaveButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: SaveButtonController,
        controllerAs: "save_button",
        scope: {},
        templateUrl: "./angularjs/components/SaveButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("saveButton", SaveButtonDirective); 