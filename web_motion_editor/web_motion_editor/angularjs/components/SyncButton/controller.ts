"use strict";

class SyncButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "$window"
    ];

    constructor(
        $scope: ng.IScope,
        public $window: ng.IWindowService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    click(): void
    {
        this.$window.alert("現在未実装の機能です。");
    }
}