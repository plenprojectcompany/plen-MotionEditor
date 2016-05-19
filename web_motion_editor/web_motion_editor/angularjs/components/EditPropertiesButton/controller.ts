class EditPropertiesButtonController
{
    disabled: boolean = false;

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

    onClick(): void
    {
        var modal = this.$modal.open({
            controller: EditPropertiesModalController,
            controllerAs: "$ctrl",
            templateUrl: "./angularjs/components/EditPropertiesModal/view.html",
            backdrop: 'static',
            keyboard: false
        });
    }
}