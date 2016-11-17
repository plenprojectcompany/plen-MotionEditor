/// <reference path="./controller.ts" />

class OpenButtonDirective
{
    static getDDO(
        model_loader: ModelLoader
    )
    {
        return {
            restrict: "E",
            controller: OpenButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/OpenButton/view.html",
            replace: true,
            link: ($scope, $element) =>
            {
                $($element[0].children[1]).on("change", (event: any) =>
                {
                    var reader = new FileReader();
                    reader.onload = (event: any) =>
                    {
                        $scope.$ctrl.motion.loadJSON(event.target.result, model_loader.getAxisMap());
                        $scope.$apply();
                    };

                    reader.readAsText(event.target.files[0]);
                });
            }
        };
    }
}

angular.module(APP_NAME).directive("openButton",
    [
        "ModelLoaderService",
        OpenButtonDirective.getDDO
    ]
);