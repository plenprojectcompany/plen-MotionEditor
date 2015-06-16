/// <reference path="./controller.ts" />

function PreviousButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: PreviousButtonController,
        controllerAs: "previous_button",
        scope: {},
        templateUrl: "./angularjs/components/PreviousButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("previousButton", PreviousButtonDirective);