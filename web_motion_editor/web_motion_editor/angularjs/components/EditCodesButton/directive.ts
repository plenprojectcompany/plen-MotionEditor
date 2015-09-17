class EditCodesButtonDirective
{
    "use strict";

    static getDDO()
    {
        return {
            restrict: "E",
            controller: EditCodesButtonController,
            controllerAs: "edit_codes_button",
            scope: {},
            templateUrl: "./angularjs/components/EditCodesButton/view.html",
            replace: true
        };
    }
}

angular.module(app_name).directive("editCodesButton",
    [
        EditCodesButtonDirective.getDDO
    ]
); 