function InstallButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: InstallButtonController,
        controllerAs: "install_button",
        scope: {},
        templateUrl: "./angularjs/components/InstallButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("installButton", InstallButtonDirective);