class ResetButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "$rootScope"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(): void
    {
        this.$rootScope.$broadcast("3DModelReset");
    }
} 