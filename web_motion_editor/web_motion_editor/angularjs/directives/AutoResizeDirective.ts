"use strict";

class AutoResizeDirective
{
    static getDDO(
        $window: ng.IWindowService,
        $timeout: ng.ITimeoutService
    )
    {
        return {
            restrict: "A",
            scope: {
                layout: "&autoResizeLayout",
                onload: "&autoResizeOnload"
            },
            link: (scope, element) =>
            {
                if (scope.onload() === true)
                {
                    element.width(scope.layout().width());
                    element.height(scope.layout().height());
                    scope.layout().resizeFook(element);
                }

                var resize_promise: any = false;

                $window.addEventListener("resize", () =>
                {
                    if (resize_promise !== false)
                    {
                        $timeout.cancel(resize_promise);
                    }

                    resize_promise = $timeout(() =>
                    {
                        element.width(scope.layout().width());
                        element.height(scope.layout().height());
                        scope.layout().resizeFook(element);
                    }, 100, false);
                });
            }
        };
    }
}

angular.module(APP_NAME).directive("autoResize",
    [
        "$window",
        "$timeout",
        AutoResizeDirective.getDDO
    ]
); 