"use strict";

class ModelLoader
{
    home_quaternions: Array<THREE.Quaternion> = [];
    rotation_axes: Array<THREE.Object3D> = [];
    not_axes: Array<THREE.Object3D> = [];

    scene: THREE.Scene;

    constructor(
        public $rootScope: ng.IRootScopeService,
        public $http: ng.IHttpService
    )
    {
    }

    addRotationAxis(object: THREE.Object3D): void
    {
        if (/roll/.test(object.name))
        {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/pitch/.test(object.name))
        {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/yaw/.test(object.name))
        {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else
        {
            this.not_axes.push(object);
        }

        if (object.children.length > 0)
        {
            _.each(object.children, (child: THREE.Object3D) =>
            {
                this.addRotationAxis(child);
            });
        }
    }

    addObject(object: THREE.Object3D): void
    {
        this.scene.add(object);
        this.addRotationAxis(object);
    }

    setScene(scene: THREE.Scene): void
    {
        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        while (scene.children.length > 0)
        {
            this.addObject(scene.children[0]);
        }
    }

    loadJSON(): void
    {
        this.$http.get("./assets/etc/plen_model.min.json")
            .success((data) =>
            {
                var model_obj:any = data;

                if (model_obj.metadata.type.toLowerCase() === "object")
                {
                    var loader = new THREE.ObjectLoader();
                    var result = loader.parse(model_obj);

                    if (result instanceof THREE.Scene)
                    {
                        this.setScene(result);
                    }
                    else
                    {
                        this.addObject(result);
                    }

                    this.$rootScope.$broadcast("3DModelLoaded");
                }
            })
            .error(() =>
            {
                alert("3Dモデルの読み込みに失敗しました。");
            });
    }
} 