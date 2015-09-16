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

        $scope.$on("ModelEditorUnfocused", () => { this.onModelEditorUnfocused(); });
        $scope.$on("3DModelLoaded", () => { this.on3DModelLoaded(); });
        $scope.$on("3DModelReset", () => { this.on3DModelReset(); });
        $scope.$on("RefreshThumbnail", () => { this.onRefreshThumbnail(); });
        $scope.$on("FrameSave", (event, frame_index: number) => { this.onFrameSave(frame_index); });
        $scope.$on("FrameLoad", (event, frame_index: number) => { this.onFrameLoad(frame_index); });
    }

    onModelEditorUnfocused(): void
    {
        this.three_model.transform_controls.detach();
        this.three_model.orbit_controls.enabled = true;
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
            var home_quaternion = this.three_model.home_quaternions[index].clone();
            var axis_quaternion = axis.quaternion.clone();
            var target_quaternion = home_quaternion.inverse().multiply(axis_quaternion);

            var theta_half_diff = Math.atan2(target_quaternion.y, target_quaternion.w);

            if (Math.abs(theta_half_diff * 2) > Math.PI)
            {
                var theta_diff = 2 * Math.PI - Math.abs(theta_half_diff * 2);

                if (theta_half_diff > 0)
                {
                    theta_diff *= -1;
                }
            }
            else
            {
                var theta_diff = theta_half_diff * 2;
            }

            this.motion.frames[frame_index].outputs.push(new OutputDeviceModel(
                axis.name,
                theta_diff * 1800 / Math.PI
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
            _.each(this.motion.frames[frame_index].outputs,(output: OutputDeviceModel, index: number) =>
            {
                var theta_diff = output.value * Math.PI / 1800;

                var home_quaternion = this.three_model.home_quaternions[index].clone();

                var target_quaternion = new THREE.Quaternion();
                target_quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), theta_diff);

                home_quaternion.multiply(target_quaternion);
                this.three_model.rotation_axes[index].quaternion.copy(home_quaternion);
            });
        }

        if (_.isEmpty(this.motion.frames[frame_index].image_uri))
        {
            this.setImage();
        }
    }

    onClick($event): void
    {
        if (!this.disabled)
        {
            this.intersect($event);
        }

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

    intersect($event): void
    {
        if ($event.type !== "click")
        {
            this.three_model.transform_controls.detach();
            this.three_model.orbit_controls.enabled = true;

            return;
        }

        this.three_model.intersect($event.clientX, $event.clientY);
    }
}