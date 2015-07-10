class ShoppingcartButtonDirective
{
    "use strict";

    static getDDO()
    {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "./angularjs/components/ShoppingcartButton/view.html",
            replace: true
        };
    }
}

angular.module(app_name).directive("shoppingcartButton",
    [
        ShoppingcartButtonDirective.getDDO
    ]
); 