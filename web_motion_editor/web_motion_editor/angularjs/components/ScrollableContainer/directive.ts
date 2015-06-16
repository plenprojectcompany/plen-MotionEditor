"use strict";

class ScrollableContainerDirective
{
    static width_offset: number = 240;

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
                        return $window.innerWidth - ScrollableContainerDirective.width_offset;
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

angular.module(app_name).directive("scrollableContainer",
    [
        "$window",
        ScrollableContainerDirective.getDDO
    ]
); 