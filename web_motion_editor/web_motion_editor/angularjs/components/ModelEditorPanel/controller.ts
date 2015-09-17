class ModelEditorPanelController
{
    disabled: boolean = false;

    private _three_model: ThreeModel;

    static $inject = [
        "$scope",
        "$rootScope",
        "SharedThreeService"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        three_model: ThreeModel
    )
    {
        this._three_model = three_model;

        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick(id: number): void
    {
        switch (id)
        {
            case 0:
                this._three_model.reverse3DModel();

                break;

            case 1:
                this._three_model.copyRightToLeft();

                break;

            case 2:
                this._three_model.copyLeftToRight();

                break;

            case 3:
                this._three_model.orbit_controls.reset();

                break;

            default:
                return;
        }

        this.$rootScope.$broadcast("RefreshThumbnail");
    }
} 