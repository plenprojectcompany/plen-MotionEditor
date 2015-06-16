/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class NewButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$rootScope",
        "$scope",
        "$window",
        "SharedMotionService"
    ];

    constructor(
        public $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        public $window: ng.IWindowService,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    click(): void
    {
        var result = this.$window.confirm(
            "本当に新規にモーションを作成しますか？\n\n" +

            "現在の作業内容が破棄されます。\n" +
            '保存がまだの場合は"キャンセル"をクリックしてください。'
        );

        if (result === true)
        {
            this.motion.reset();
            this.$rootScope.$broadcast("3DModelReset");
        }
    }
}