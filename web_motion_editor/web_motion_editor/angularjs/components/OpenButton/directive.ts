/// <reference path="./controller.ts" />

function OpenButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: OpenButtonController,
        controllerAs: "open_button",
        scope: {},
        templateUrl: "./angularjs/components/OpenButton/view.html",
        replace: true,
        link: (scope, element, attrs) =>
        {
            $(element[0].children[1]).on("change", (event: any) =>
            {
                var reader = new FileReader();
                reader.onload = (event: any) =>
                {
                    scope.open_button.motion.loadJSON(event.target.result);
                    scope.$apply();
                };

                reader.readAsText(event.target.files[0]);
            });
        }
    };
}

angular.module(app_name).directive("openButton", OpenButtonDirective); 