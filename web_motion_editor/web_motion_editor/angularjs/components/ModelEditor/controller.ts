/// <reference path="../../services/SharedThreeService.ts" />
/// <reference path="../../services/SharedMotionService.ts" />
/// <reference path="../../services/ImageStoreService.ts" />

class ModelEditorController
{
    disabled: boolean = false;

    static $inject = [
        "$scope",
        "ModelLoaderService",
        "SharedThreeService",
        "SharedMotionService",
        "ImageStoreService"
    ];

    constructor(
        $scope: ng.IScope,
        public model_loader: ModelLoader,
        public three_model: ThreeModel,
        public motion: MotionModel,
        public image_store_service: ImageStoreService
    )
    {
        $scope.$on("ComponentDisabled", () => { this.disabled = true; });
        $scope.$on("ComponentEnabled", () => { this.disabled = false; });

        $scope.$on("3DModelLoaded", () => { this.on3DModelLoaded(); });
        $scope.$on("3DModelReset", () => { this.on3DModelReset(); });
        $scope.$on("RefreshThumbnail", () => { this.onRefreshThumbnail(); });
        $scope.$on("FrameSave", (event, frame_index: number) => { this.onFrameSave(frame_index); });
        $scope.$on("FrameLoad", (event, frame_index: number) => { this.onFrameLoad(frame_index); });
    }

    on3DModelLoaded(): void
    {
        this.setImage();

        this.three_model.home_quaternions = this.model_loader.home_quaternions;
        this.three_model.rotation_axes = this.model_loader.rotation_axes;
        this.three_model.not_axes = this.model_loader.not_axes;

        var json = localStorage.getItem("motion");

        if (!_.isNull(json))
        {
            this.motion.loadJSON(json, this.model_loader.getAxisMap());
        }
    }

    on3DModelReset(): void
    {
        this.three_model.reset();
        this.setImage();
    }

    onRefreshThumbnail(): void
    {
        this.setImage();
    }

    onFrameSave(frame_index: number): void
    {
        this.motion.frames[frame_index].outputs = [];

        _.each(this.three_model.rotation_axes, (axis: THREE.Object3D, index: number) =>
        {
            this.motion.frames[frame_index].outputs.push(new OutputDeviceModel(
                axis.name,
                this.three_model.getDiffAngle(axis, index)
            ));
        });
    }

    onFrameLoad(frame_index: number): void
    {
        if (_.isEmpty(this.motion.frames[frame_index].outputs))
        {
            this.three_model.reset();
            this.setImage();
        }
        else
        {
            _.each(this.motion.frames[frame_index].outputs, (output: OutputDeviceModel, index: number) =>
            {
                this.three_model.setDiffAngle(null, output.value, index);
            });
        }

        if (_.isEmpty(this.motion.frames[frame_index].image_uri))
        {
            this.setImage();
        }
    }

    onFocus($event): void
    {
        if (this.disabled)
        {
            return;
        }

        if (!_.isUndefined($event.touches))
        {
            if ($event.touches.length === 1)
            {
                var intersected: boolean = this.three_model.intersect($event.clientX, $event.clientY);

                if (intersected)
                {
                    this.three_model.transform_controls.$onPointerDown($event);
                }
            }
        }
        else
        {
            var intersected: boolean = this.three_model.intersect($event.clientX, $event.clientY);

            if (intersected)
            {
                this.three_model.transform_controls.$onPointerDown($event);
            }
        }
    }

    onUnfocus(): void
    {
        this.three_model.transform_controls.detach();
        this.three_model.orbit_controls.enabled = true;

        this.setImage();
    }

    setImage(): void
    {
        this.three_model.refresh();

        var image = this.three_model.renderer.domElement;
        this.image_store_service.set(image);

        var selected_frame = _.find(this.motion.frames,(frame: FrameModel) =>
        {
            return frame.selected;
        });
        selected_frame.image_uri = this.image_store_service.get();
    }
}