/// <reference path="../../business_logic/ModelLoader.ts" />

angular.module(app_name).service("ModelLoaderService",
    [
        "$rootScope",
        "$http",
        ModelLoader
    ]
); 