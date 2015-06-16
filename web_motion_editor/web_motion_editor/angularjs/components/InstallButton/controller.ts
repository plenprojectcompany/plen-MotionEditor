"use strict";

class InstallButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$window",
        "$scope"
    ];

    constructor(
        public $window: ng.IWindowService,
        $scope: ng.IScope
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$window.alert("現在未実装の機能です。");
    }
} 