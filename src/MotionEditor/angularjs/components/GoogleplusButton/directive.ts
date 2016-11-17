/// <reference path="./controller.ts" />

class GoogleplusButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: GoogleplusButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/GoogleplusButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("googleplusButton",
    [
        GoogleplusButtonDirective.getDDO
    ]
);