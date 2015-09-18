class EditPropertiesButtonDirective
{
    "use strict";

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

angular.module(app_name).directive("editPropertiesButton",
    [
        EditPropertiesButtonDirective.getDDO
    ]
); 