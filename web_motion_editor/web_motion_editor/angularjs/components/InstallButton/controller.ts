/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

"use strict";

class InstallButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$modal",
        "$scope"
    ];

    constructor(
        public $modal: angular.ui.bootstrap.IModalService,
        $scope: ng.IScope
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        var modal = this.$modal.open({
            controller: ModalController,
            controllerAs: "modal",
            templateUrl: "./angularjs/components/PLENControlServerModal/view.html"
        });
    }
} 