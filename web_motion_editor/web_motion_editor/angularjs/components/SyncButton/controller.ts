/// <reference path="../../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

"use strict";

class SyncButtonController
{
    disabled: boolean = false;
    syncing: boolean = false;

    static $inject = [
        "$scope",
        "$modal"
    ];

    constructor(
        $scope: ng.IScope,
        public $modal: angular.ui.bootstrap.IModalService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    click(): void
    {
        var modal = this.$modal.open({
            controller: ModalController,
            controllerAs: "modal",
            templateUrl: "./angularjs/components/PLENControlServerModal/view.html"
        });

        this.syncing = !this.syncing;
    }
}