/// <reference path="./controller.ts" />

class FrameEditorDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: FrameEditorController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/FrameEditor/view.html"
        };
    }
}

angular.module(APP_NAME).directive("frameEditor",
    [
        FrameEditorDirective.getDDO
    ]
);