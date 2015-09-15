// @todo *.d.tsに分離
declare module THREE
{
    class TransformControls
    {
        constructor(object: Camera, domElement?: HTMLElement);

        setSpace(__: string): void;
        setMode(__: string): void;
        object: Object3D;
    }
}

class ThreeModel
{
    "use strict";

    layout: any;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    grid: THREE.GridHelper;
    light: THREE.SpotLight;
    renderer: THREE.WebGLRenderer;

    home_quaternions: Array<THREE.Quaternion> = [];
    rotation_axes: Array<THREE.Object3D> = [];
    not_axes: Array<THREE.Object3D> = [];

    orbit_controls: THREE.OrbitControls;
    transform_controls: any;

    constructor()
    {
        // noop.
    }

    init($element: any, layout: any): void
    {
        this.layout = layout;
        var width  = this.layout.width();
        var height = this.layout.height();

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(200, 200, 500);

        this.grid = new THREE.GridHelper(1000, 100);
        this.grid.position.set(0, 0, 0);
        this.grid.setColors(0xB2DB11, 0xFFFFFF);
        this.scene.add(this.grid);

        this.light = new THREE.SpotLight(0xBBBBBB);
        this.scene.add(this.light);

        this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x66BB6A);

        this.orbit_controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbit_controls.zoomSpeed = 0.3;
        this.orbit_controls.minDistance = 10;
        this.orbit_controls.maxDistance = 2000;

        this.transform_controls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transform_controls.setSpace("local");
        this.transform_controls.setMode("rotate");
        this.scene.add(this.transform_controls);

        $element.append(this.renderer.domElement);

        this.renderer.render(this.scene, this.camera);
    }

    reset(): void
    {
        _.each(this.rotation_axes, (axis: THREE.Object3D, index: number) =>
        {
            axis.quaternion.copy(this.home_quaternions[index]);
        });
    }

    resize(): void
    {
        var width  = this.layout.width();
        var height = this.layout.height();

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    animate(): void
    {
        this.refresh();

        requestAnimationFrame(() => { this.animate(); });
    }

    refresh(): void
    {
        this.orbit_controls.update();
        this.transform_controls.update();

        var theta  = Math.atan2(this.camera.position.x, this.camera.position.z);
        var phi    = Math.atan2(Math.sqrt(this.camera.position.x * this.camera.position.x + this.camera.position.z * this.camera.position.z), this.camera.position.y);
        var radius = Math.sqrt(3) * 1000;
        
        this.light.position.x = radius * Math.sin(phi) * Math.sin(theta);
        this.light.position.y = radius * Math.cos(phi);
        this.light.position.z = radius * Math.sin(phi) * Math.cos(theta);

        this.renderer.render(this.scene, this.camera);
    }

    intersect(screen_x: number, screen_y: number): void
    {
        var rect = this.renderer.domElement.getBoundingClientRect();
        var x = (screen_x - rect.left) / rect.width;
        var y = (screen_y - rect.top) / rect.height;

        var pointer_vector = new THREE.Vector3((x * 2) - 1, -(y * 2) + 1, 0.5);
        pointer_vector.unproject(this.camera);

        var ray = new THREE.Raycaster(
            this.camera.getWorldPosition(),
            pointer_vector.sub(this.camera.getWorldPosition()).normalize()
        );

        var intersections = ray.intersectObjects(this.not_axes, true);

        if (intersections[0])
        {
            this.transform_controls.detach();

            _.each(this.rotation_axes, (axis: THREE.Object3D) =>
            {
                if (axis === intersections[0].object.parent)
                {
                    this.transform_controls.attach(axis);
                    this.orbit_controls.enabled = false;

                    return false;
                }
                else
                {
                    this.orbit_controls.enabled = true;
                }
            });
        }
        else
        {
            this.transform_controls.detach();
            this.orbit_controls.enabled = true;
        }
    }

    getDiffAngle(): any
    {
        var angle = {
            axis_name: null,
            diff_angle: null
        };

        if (!_.isUndefined(this.transform_controls.object))
        {
            var selected_axis_index = _.findIndex(this.rotation_axes, (axis: THREE.Object3D) =>
            {
                return axis === this.transform_controls.object;
            });

            var home_quaternion = this.home_quaternions[selected_axis_index].clone();
            var axis_quaternion = this.rotation_axes[selected_axis_index].quaternion.clone();
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

            angle.axis_name = this.rotation_axes[selected_axis_index].name;
            angle.diff_angle = Math.round(theta_diff * 1800 / Math.PI);
        }

        return angle;
    }
} 