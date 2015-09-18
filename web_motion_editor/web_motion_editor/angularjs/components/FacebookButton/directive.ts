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

angular.module(app_name).directive("facebookButton",
    [
        FacebookButtonDirective.getDDO
    ]
);