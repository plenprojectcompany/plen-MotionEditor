/// <reference path="../../business_logic/ModelLoader.ts" />

angular.module(APP_NAME).service("ModelLoaderService", [
    "$rootScope",
    "$http",
    ModelLoader
]); 