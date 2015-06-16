/// <reference path="../../business_logic/ThreeModel.ts" />

"use strict";

class ThreeFactory
{
    constructor()
    {
    }

    getThree(): ThreeModel
    {
        return new ThreeModel();
    }
}

angular.module(app_name).service("ThreeFactory", ThreeFactory);