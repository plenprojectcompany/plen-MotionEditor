class EditCodesButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope"
    ];

    constructor(
        $scope: ng.IScope
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }
} 