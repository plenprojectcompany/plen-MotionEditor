/// <reference path="../../services/SharedMotionService.ts" />

"use strict";

class SaveButtonController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "$element",
        "SharedMotionService"
    ];

    constructor(
        $scope: ng.IScope,
        public $element,
        public motion: MotionModel
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });

        $element.on("touchstart", () => { this.onClick(); });
    }

    onClick(): void
    {
        if (!this.disabled)
        {
            this.setDownloadLink();
        }
    }

    setDownloadLink(): void
    {
        var json_blob = new Blob([this.motion.saveJSON()], { type: "text/plain" });

        if (navigator.msSaveBlob)
        {
            navigator.msSaveBlob(json_blob, this.motion.name + ".json");
        }
        else
        {
            var reader = new FileReader();
            reader.onload = (event: any) =>
            {
                this.$element[0].href = reader.result;
            };

            reader.readAsDataURL(json_blob);
        }
    }
}  