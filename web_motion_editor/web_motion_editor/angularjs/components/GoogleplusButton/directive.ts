/// <reference path="./controller.ts" />

function GoogleplusButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: GoogleplusButtonController,
        controllerAs: "googleplus_button",
        scope: {},
        templateUrl: "./angularjs/components/GoogleplusButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("googleplusButton", GoogleplusButtonDirective);    