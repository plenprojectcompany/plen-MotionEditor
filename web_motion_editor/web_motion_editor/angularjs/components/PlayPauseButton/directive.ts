class PlayPauseButtonDirective
{
    "use strict";

    static getDDO()
    {
        return {
            restrict: "E",
            controller: PlayPauseButtonController,
            controllerAs: "play_pause_button",
            scope: {},
            templateUrl: "./angularjs/components/PlayPauseButton/view.html",
            replace: true
        };
    }
}

angular.module(app_name).directive("playPauseButton",
    [
        PlayPauseButtonDirective.getDDO
    ]
);