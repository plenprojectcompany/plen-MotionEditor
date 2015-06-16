"use strict";

class StopButtonController
{
    static $inject = [
        "$rootScope"
    ];

    constructor(
        public $rootScope: ng.IRootScopeService
    )
    {
        //  noop.
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("AnimationStop");
    }
}  