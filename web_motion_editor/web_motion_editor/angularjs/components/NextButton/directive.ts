/// <reference path="./controller.ts" />

function NextButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: NextButtonController,
        controllerAs: "next_button",
        scope: {},
        templateUrl: "./angularjs/components/NextButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("nextButton", NextButtonDirective); 