/// <reference path="../../services/SharedMotionService.ts" />
/// <reference path="../../services/AnimationHelperService.ts" />

class FrameEditorController
{
    disabled: boolean = false;
    touch_disabled: boolean = 'ontouchend' in document;

    sortable_options = {
        axis: "x",
        scroll: false,
        revert: true
    };

    static $inject = [
        "$scope",
        "SharedMotionService",
        "AnimationHelperService"
    ];

    constructor(
        $scope: ng.IScope,
        public motion: MotionModel,
        public animation_helper: AnimationHelper
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });
    }

    onClick($event: any): void
    {
        if ($event.target.id === "frame_editor")
        {
            var offset_x;

            // Fix for firefox.
            if (_.isUndefined($event.offsetX))
            {
                offset_x = $event.pageX - $($event.target).offset().left;
            }
            else
            {
                offset_x = $event.offsetX;
            }

            var insert_pos = Math.floor(offset_x / 173);

            if (insert_pos > this.motion.frames.length)
            {
                this.motion.addFrame(this.motion.frames.length);
            }
            else
            {
                this.motion.addFrame(insert_pos);
            }
        }
    }
}