/// <reference path="./controller.ts" />

class PreviousButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: PreviousButtonController,
            controllerAs: "previous_button",
            scope: {},
            templateUrl: "./angularjs/components/PreviousButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("previousButton",
    [
        PreviousButtonDirective.getDDO
    ]
);