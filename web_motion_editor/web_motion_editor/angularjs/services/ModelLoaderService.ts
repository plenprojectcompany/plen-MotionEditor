/// <reference path="../../business_logic/ModelLoader.ts" />

"use strict";

angular.module(app_name).service("ModelLoaderService",
    [
        "$rootScope",
        "$http",
        ModelLoader
    ]
); 