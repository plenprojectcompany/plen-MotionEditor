/// <reference path="./controller.ts" />

class FrameEditorDirective
{
    "use strict";

    static getDDO(
        // $rootScope: ng.IRootScopeService
    )
    {
        return {
            restrict: "E",
            controller: FrameEditorController,
            controllerAs: "frame_editor",
            scope: {},
            templateUrl: "./angularjs/components/FrameEditor/view.html"
        };
    }
}

angular.module(app_name).directive("frameEditor",
    [
        // "$rootScope",
        FrameEditorDirective.getDDO
    ]
);