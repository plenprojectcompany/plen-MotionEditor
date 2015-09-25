class DiffAngleViewerController
{
    name: string = "none";
    diff_angle: number = 0;

    static $inject = [
        "SharedThreeService"
    ];

    constructor(
        public three_model: ThreeModel
    )
    {
        // noop.
    }

    onAngleChange(): void
    {
        this.name = this.three_model.transform_controls.object.name;
        this.diff_angle = this.three_model.getDiffAngle(this.three_model.transform_controls.object) / 10;
    }
}