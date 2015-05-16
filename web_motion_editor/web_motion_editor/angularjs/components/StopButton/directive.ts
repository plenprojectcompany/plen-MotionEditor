function StopButtonDirective()
{
    "use strict";

    return {
        restrict: 'E',
        controller: StopButtonController,
        controllerAs: 'stop_button',
        scope: {},
        templateUrl: "./angularjs/components/StopButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("stopButton", StopButtonDirective);