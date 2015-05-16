/// <reference path="../../services/ModelLoaderService.ts" />
/// <reference path="./controller.ts" />

"use strict";

class ModelEditorDirective
{
    static width_offset: number  = 240 + 45;
    static height_offset: number = 186 + 40;

    static getDDO(
        $rootScope: ng.IRootScopeService,
        $window: ng.IWindowService,
        model_loader: ModelLoader
    )
    {
        return {
            restrict: "E",
            controller: ModelEditorController,
            controllerAs: "model_editor",
            template: '<div id="model_editor" ng-click="model_editor.onClick($event)"></div>',
            link: (scope, element) =>
            {
                scope.model_editor.layout = {
                    width: () =>
                    {
                        return $window.innerWidth - ModelEditorDirective.width_offset;
                    },
                    height: () =>
                    {
                        return $window.innerHeight - ModelEditorDirective.height_offset;
                    },
                    resizeFook: (element) =>
                    {
                        scope.model_editor.three_model.resize();
                    }
                };

                scope.model_editor.three_model.init($("#model_editor"), scope.model_editor.layout);
                scope.model_editor.three_model.animate();

                $("body").on("click", (event) =>
                {
                    if (event.target !== scope.model_editor.three_model.renderer.domElement)
                    {
                        $rootScope.$broadcast("ModelEditorUnfocused");
                    }
                });

                $("#model_editor canvas").on("touchend", (event) =>
                {
                    scope.model_editor.onClick(event);
                    scope.$apply();
                });

                model_loader.scene = scope.model_editor.three_model.scene;
                model_loader.loadJSON();
            }
        };
    }
}

angular.module(app_name).directive("modelEditor",
    [
        "$rootScope",
        "$window",
        "ModelLoaderService",
        ModelEditorDirective.getDDO
    ]
);