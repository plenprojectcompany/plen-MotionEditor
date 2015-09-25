class ScrollableContainerDirective
{
    static WIDTH_OFFSET: number = 220;

    static getDDO(
        $window: ng.IWindowService
    )
    {
        return {
            restrict: "A",
            controller: () => {},
            controllerAs: "scrollable_container",
            template: "<div ng-transclude/>",
            transclude: true,
            link: (scope) =>
            {
                scope.scrollable_container.layout = {
                    width: () =>
                    {
                        return $window.innerWidth - ScrollableContainerDirective.WIDTH_OFFSET;
                    },
                    height: () =>
                    {
                        return 158;
                    },
                    resizeFook: () => {}
                };
            }
        };
    }
}

angular.module(APP_NAME).directive("scrollableContainer",
    [
        "$window",
        ScrollableContainerDirective.getDDO
    ]
); 