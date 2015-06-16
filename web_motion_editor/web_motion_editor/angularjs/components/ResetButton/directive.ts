function ResetButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: ResetButtonController,
        controllerAs: "reset_button",
        scope: {},
        templateUrl: "./angularjs/components/ResetButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("resetButton", ResetButtonDirective);  