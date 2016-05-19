/// <reference path="./controller.ts" />

class PlayPauseButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: PlayPauseButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/PlayPauseButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("playPauseButton",
    [
        PlayPauseButtonDirective.getDDO
    ]
);