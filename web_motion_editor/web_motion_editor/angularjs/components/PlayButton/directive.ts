function PlayButtonDirective()
{
    "use strict";

    return {
        restrict: "E",
        controller: PlayButtonController,
        controllerAs: 'play_button',
        scope: {},
        templateUrl: "./angularjs/components/PlayButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("playButton", PlayButtonDirective);