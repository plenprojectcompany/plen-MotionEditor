/// <reference path="./controller.ts" />

class NextButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: NextButtonController,
            controllerAs: "next_button",
            scope: {},
            templateUrl: "./angularjs/components/NextButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("nextButton",
    [
        NextButtonDirective.getDDO
    ]
);