/// <reference path="./controller.ts" />

class EditPropertiesButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: EditPropertiesButtonController,
            controllerAs: "edit_properties_button",
            scope: {},
            templateUrl: "./angularjs/components/EditPropertiesButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("editPropertiesButton",
    [
        EditPropertiesButtonDirective.getDDO
    ]
); 