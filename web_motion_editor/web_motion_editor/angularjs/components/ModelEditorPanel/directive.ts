class ModelEditorPanelDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: ModelEditorPanelController,
            controllerAs: "model_editor_panel",
            scope: {},
            templateUrl: "./angularjs/components/ModelEditorPanel/view.html",
            replace: true
        };
    }
}

angular.module(app_name).directive("modelEditorPanel",
    [
        ModelEditorPanelDirective.getDDO
    ]
); 