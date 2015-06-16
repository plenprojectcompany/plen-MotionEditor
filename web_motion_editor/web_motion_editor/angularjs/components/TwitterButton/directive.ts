/// <reference path="./controller.ts" />

function TwitterButtonDirective()
{
    "use strict";

    return {
        restrict: 'E',
        controller: TwitterButtonController,
        controllerAs: 'twitter_button',
        scope: {},
        templateUrl: "./angularjs/components/TwitterButton/view.html",
        replace: true
    };
}

angular.module(app_name).directive("twitterButton", TwitterButtonDirective);