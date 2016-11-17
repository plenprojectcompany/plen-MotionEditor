class ShoppingcartButtonDirective
{
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

angular.module(APP_NAME).directive("shoppingcartButton",
    [
        ShoppingcartButtonDirective.getDDO
    ]
); 