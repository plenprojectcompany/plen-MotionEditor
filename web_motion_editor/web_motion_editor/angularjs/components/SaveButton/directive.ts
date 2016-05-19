/// <reference path="./controller.ts" />

class SaveButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: SaveButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/SaveButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("saveButton",
    [
        SaveButtonDirective.getDDO
    ]
);