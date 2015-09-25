/// <reference path="./controller.ts" />

class DiffAngleViewerDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: DiffAngleViewerController,
            controllerAs: "diff_angle_viewer",
            scope: {},
            templateUrl: "./angularjs/components/DiffAngleViewer/view.html",
            replace: true,
            link: ($scope) => 
            {
                $("body").on("angleChange", () =>
                {
                    $scope.diff_angle_viewer.onAngleChange();
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