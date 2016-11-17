/// <reference path="./controller.ts" />

class ResetButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: ResetButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/ResetButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("resetButton",
    [
        ResetButtonDirective.getDDO
    ]
);