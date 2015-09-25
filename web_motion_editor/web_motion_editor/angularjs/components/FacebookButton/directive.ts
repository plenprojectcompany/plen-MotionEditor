/// <reference path="./controller.ts" />

class FacebookButtonDirective
{
    static getDDO()
    {
        return {
            restrict: 'E',
            controller: FacebookButtonController,
            controllerAs: 'facebook_button',
            scope: {},
            templateUrl: "./angularjs/components/FacebookButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("facebookButton",
    [
        FacebookButtonDirective.getDDO
    ]
);