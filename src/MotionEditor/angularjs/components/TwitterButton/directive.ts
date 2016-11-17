/// <reference path="./controller.ts" />

class TwitterButtonDirective
{
    static getDDO()
    {
        return {
            restrict: 'E',
            controller: TwitterButtonController,
            controllerAs: '$ctrl',
            scope: {},
            templateUrl: "./angularjs/components/TwitterButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("twitterButton",
    [
        TwitterButtonDirective.getDDO
    ]
);