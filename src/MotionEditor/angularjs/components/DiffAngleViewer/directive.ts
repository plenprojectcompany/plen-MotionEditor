/// <reference path="./controller.ts" />

class DiffAngleViewerDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: DiffAngleViewerController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/DiffAngleViewer/view.html",
            replace: true,
            link: ($scope) => 
            {
                $("html").on("angleChange.toDiffAngleViewer", () =>
                {
                    $scope.$ctrl.onAngleChange();
                    $scope.$apply();
                });
            }
        };
    }
}

angular.module(APP_NAME).directive("diffAngleViewer",
    [
        DiffAngleViewerDirective.getDDO
    ]
);  