/// <reference path='../../services/ModelLoaderService.ts' />
/// <reference path='./controller.ts' />

class ModelEditorDirective
{
    static WIDTH_OFFSET: number  = 220 + 45;
    static HEIGHT_OFFSET: number = 186 + 40;

    static getDDO(
        $rootScope: ng.IRootScopeService,
        $window: ng.IWindowService,
        $location: ng.ILocationService,
        model_loader: ModelLoader
    )
    {
        return {
            restrict: 'E',
            controller: ModelEditorController,
            controllerAs: '$model_editor',
            replace: true,
            templateUrl: './angularjs/components/ModelEditor/view.html',
            link: {
                pre: ($scope) =>
                {
                    // Layout object's definition.
                    $scope.$model_editor.layout = {
                        width: () =>
                        {
                            return $window.innerWidth - ModelEditorDirective.WIDTH_OFFSET;
                        },
                        height: () =>
                        {
                            return $window.innerHeight - ModelEditorDirective.HEIGHT_OFFSET;
                        },
                        resizeFook: () =>
                        {
                            $scope.$model_editor.three_model.resize();
                        }
                    };

                    $scope.$model_editor.three_model.init($('#canvas_wrapper'), $scope.$model_editor.layout);
                    $scope.$model_editor.three_model.animate();

                    // The hook when pointer is focused.
                    $('#canvas_wrapper canvas').on('mousedown touchstart', (event: Event) =>
                    {
                        $scope.$model_editor.onFocus(event);
                    });

                    // The hook when pointer is unfocused.
                    $('#canvas_wrapper canvas').on('mouseup mouseout touchend touchcancel touchleave', () =>
                    {
                        $scope.$model_editor.onUnfocus();
                        $scope.$apply();
                    });

                    model_loader.scene = $scope.$model_editor.three_model.scene;

                    var model_name = $location.search()['model'];

                    console.log(model_name);

                    if (/^plen2$/.test(model_name) || /^plen2-mini$/.test(model_name))
                    {
                        model_loader.loadJSON(model_name);
                    }
                    else
                    {
                        model_loader.loadJSON();
                    }
                }
            }
        };
    }
}

angular.module(APP_NAME).directive('modelEditor', [
    '$rootScope',
    '$window',
    '$location',
    'ModelLoaderService',
    ModelEditorDirective.getDDO
]);