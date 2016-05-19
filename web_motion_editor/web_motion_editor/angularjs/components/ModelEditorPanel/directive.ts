/// <reference path="./controller.ts" />

class ModelEditorPanelDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: ModelEditorPanelController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/ModelEditorPanel/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("modelEditorPanel",
    [
        ModelEditorPanelDirective.getDDO
    ]
); 