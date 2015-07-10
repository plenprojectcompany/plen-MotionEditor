"use strict";
var app_name = "PLEN2MotionEditorForWeb";
angular.module(app_name, ["ngAnimate", "ui.sortable"]);
"use strict";
var FacebookButtonController = (function () {
    function FacebookButtonController($window) {
        this.$window = $window;
        this.href = "http://www.facebook.com/share.php?u=http://plen.jp/playground/motion-editor/";
    }
    FacebookButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), "facebook_window", "width=650, height=470, menubar=no, toolbar=no, location=no, scrollbars=yes, sizable=yes");
    };
    FacebookButtonController.$inject = ["$window"];
    return FacebookButtonController;
})();
function FacebookButtonDirective() {
    "use strict";
    return {
        restrict: 'E',
        controller: FacebookButtonController,
        controllerAs: 'facebook_button',
        scope: {},
        templateUrl: "./angularjs/components/FacebookButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("facebookButton", FacebookButtonDirective);
"use strict";
var CodeModel = (function () {
    function CodeModel(func, argments) {
        this.func = func;
        this.argments = argments;
    }
    return CodeModel;
})();
"use strict";
var OutputDeviceModel = (function () {
    function OutputDeviceModel(device, value) {
        this.device = device;
        this.value = value;
    }
    return OutputDeviceModel;
})();
"use strict";
var FrameModel = (function () {
    function FrameModel(transition_time_ms, outputs, selected, image_uri) {
        this.transition_time_ms = transition_time_ms;
        this.outputs = outputs;
        this.selected = selected;
        this.image_uri = image_uri;
    }
    Object.defineProperty(FrameModel.prototype, "transition_time_ms", {
        get: function () {
            return this._transition_time_ms;
        },
        set: function (value) {
            if (_.isString(value)) {
                this._transition_time_ms = _.parseInt(value);
            }
            if (_.isNumber(value)) {
                this._transition_time_ms = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    FrameModel.prototype.deepCopy = function (frame) {
        var _this = this;
        this.transition_time_ms = frame.transition_time_ms;
        this.selected = frame.selected;
        this.image_uri = frame.image_uri;
        this.outputs = [];
        _.each(frame.outputs, function (output) {
            _this.outputs.push(new OutputDeviceModel(output.device, output.value));
        });
    };
    return FrameModel;
})();
"use strict";
var MotionModel = (function () {
    function MotionModel($rootScope, frame_factory) {
        this.$rootScope = $rootScope;
        this.frame_factory = frame_factory;
        this.slot = 0;
        this.name = "Test Motion";
        this.codes = [];
        this.frames = [];
        this.frames.push(this.frame_factory.getFrame());
    }
    MotionModel.prototype.getSelectedFrameIndex = function () {
        return _.findIndex(this.frames, function (frame) {
            return frame.selected;
        });
    };
    MotionModel.prototype.removeFrame = function (index) {
        if (this.frames.length !== MotionModel.MIN_FRAMES) {
            if (this.frames[index].selected === true) {
                if ((index + 1) === this.frames.length) {
                    this.selectFrame(index - 1);
                }
                else {
                    this.selectFrame(index + 1);
                }
            }
            this.frames.splice(index, 1);
        }
        else {
            this.reset();
        }
    };
    MotionModel.prototype.addFrame = function (index) {
        if (this.frames.length >= MotionModel.MAX_FRAMES) {
            return;
        }
        var selected_frame = _.find(this.frames, function (frame) {
            return frame.selected;
        });
        var copy_index = _.findIndex(this.frames, function (frame) {
            return frame.selected;
        });
        this.$rootScope.$broadcast("FrameSave", copy_index);
        var insertion_frame = this.frame_factory.getFrame(false);
        insertion_frame.deepCopy(selected_frame);
        insertion_frame.selected = false;
        this.frames.splice(index, 0, insertion_frame);
        this.selectFrame(index, false);
    };
    MotionModel.prototype.selectFrame = function (index, old_save) {
        if (old_save === void 0) { old_save = true; }
        if (old_save) {
            var old_index = _.findIndex(this.frames, function (frame) {
                return frame.selected;
            });
            this.$rootScope.$broadcast("FrameSave", old_index);
        }
        _.each(this.frames, function (frame) {
            frame.selected = false;
        });
        this.frames[index].selected = true;
        this.$rootScope.$broadcast("FrameLoad", index);
    };
    MotionModel.prototype.selectNextFrame = function () {
        var index = _.findIndex(this.frames, function (frame) {
            return frame.selected;
        });
        if ((index + 1) !== this.frames.length) {
            this.selectFrame(index + 1);
        }
    };
    MotionModel.prototype.selectPrevFrame = function () {
        var index = _.findIndex(this.frames, function (frame) {
            return frame.selected;
        });
        if (index !== 0) {
            this.selectFrame(index - 1);
        }
    };
    MotionModel.prototype.reset = function () {
        this.frames = [this.frame_factory.getFrame()];
        this.$rootScope.$broadcast("FrameLoad", 0);
    };
    MotionModel.prototype.loadJSON = function (motion_json, axis_map) {
        var _this = this;
        try {
            var motion_obj = JSON.parse(motion_json);
            if (_.isUndefined(motion_obj.slot) || !_.isNumber(motion_obj.slot)) {
                throw "Bad format!.";
            }
            if (_.isUndefined(motion_obj.name) || !_.isString(motion_obj.name)) {
                throw "Bad format!.";
            }
            if (_.isUndefined(motion_obj.codes) || !_.isArray(motion_obj.codes)) {
                throw "Bad format!.";
            }
            _.each(motion_obj.codes, function (code) {
                if (_.isUndefined(code.func) || !_.isString(code.func)) {
                    throw "Bad format!.";
                }
                if (_.isUndefined(code.argments) || !_.isArray(code.argments)) {
                    throw "Bad format!.";
                }
                else {
                    _.each(code.argments, function (argment) {
                        if (!_.isString(argment)) {
                            throw "Bad format!.";
                        }
                    });
                }
            });
            if (_.isUndefined(motion_obj.frames) || !_.isArray(motion_obj.frames)) {
                throw "Bad format!.";
            }
            else {
                _.each(motion_obj.frames, function (frame) {
                    if (_.isUndefined(frame.transition_time_ms) || !_.isNumber(frame.transition_time_ms)) {
                        throw "Bad format!.";
                    }
                    if (_.isUndefined(frame.outputs) || !_.isArray(frame.outputs)) {
                        throw "Bad format!.";
                    }
                    else {
                        _.each(frame.outputs, function (output) {
                            if (_.isUndefined(output.device) || !_.isString(output.device)) {
                                throw "Bad format!.";
                            }
                            if (_.isUndefined(output.value) || !_.isNumber(output.value)) {
                                throw "Bad format!.";
                            }
                        });
                    }
                });
            }
            this.slot = motion_obj.slot;
            this.name = motion_obj.name;
            this.codes = [];
            _.each(motion_obj.codes, function (code) {
                var argments = [];
                _.each(code.argments, function (argment) {
                    argments.push(argment);
                });
                _this.codes.push(new CodeModel(code.func, argments));
            });
            this.frames = [];
            _.each(motion_obj.frames, function (frame) {
                var outputs = [];
                _.each(frame.outputs, function (output) {
                    outputs[axis_map[output.device]] = new OutputDeviceModel(output.device, output.value);
                });
                _this.frames.push(new FrameModel(frame.transition_time_ms, outputs, false, ""));
            });
            this.selectFrame(0, false);
        }
        catch (exception) {
            alert("不正なモーションファイルのため、読み込みに失敗しました。");
        }
    };
    MotionModel.prototype.saveJSON = function () {
        var motion_obj = {
            slot: this.slot,
            name: this.name,
            codes: this.codes,
            frames: []
        };
        _.each(this.frames, function (frame) {
            var pure_frame = {};
            pure_frame.transition_time_ms = frame._transition_time_ms;
            pure_frame.outputs = frame.outputs;
            _.each(pure_frame.outputs, function (output) {
                output.value = Math.round(output.value);
            });
            motion_obj.frames.push(pure_frame);
        });
        return JSON.stringify(motion_obj, null, "\t");
    };
    MotionModel.MIN_FRAMES = 1;
    MotionModel.MAX_FRAMES = 20;
    return MotionModel;
})();
"use strict";
var ImageStoreService = (function () {
    function ImageStoreService() {
        this._image_canvas = angular.element("<canvas/>")[0];
        this._image_canvas.width = 150;
        this._image_canvas.height = 150;
        this._context = this._image_canvas.getContext("2d");
    }
    ImageStoreService.prototype.set = function (image) {
        var sx, sy, sw, sh;
        if (image.width > image.height) {
            sy = 0;
            sw = image.height;
            sh = image.height;
            sx = (image.width - sw) / 2;
        }
        else {
            sx = 0;
            sw = image.width;
            sh = image.width;
            sy = (image.height - sh) / 2;
        }
        this._context.drawImage(image, sx, sy, sw, sh, 0, 0, 150, 150);
    };
    ImageStoreService.prototype.get = function () {
        return this._image_canvas.toDataURL();
    };
    return ImageStoreService;
})();
angular.module(app_name).service("ImageStoreService", ImageStoreService);
"use strict";
var FrameFactory = (function () {
    function FrameFactory(image_store_service) {
        this.image_store_service = image_store_service;
    }
    FrameFactory.prototype.getFrame = function (selected) {
        if (selected === void 0) { selected = true; }
        return new FrameModel(100, [], selected, this.image_store_service.get());
    };
    FrameFactory.$inject = ["ImageStoreService"];
    return FrameFactory;
})();
angular.module(app_name).service("FrameFactory", FrameFactory);
"use strict";
angular.module(app_name).service("SharedMotionService", [
    "$rootScope",
    "FrameFactory",
    MotionModel
]);
"use strict";
var FrameEditorController = (function () {
    function FrameEditorController($scope, $rootScope, $q, $interval, motion) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.$interval = $interval;
        this.motion = motion;
        this.disabled = false;
        this.touch_disabled = 'ontouchend' in document;
        this.sortable_options = {
            axis: "x",
            scroll: false,
            revert: true
        };
        this.outputs_backup = [];
        this.animation_diffs = [];
        this.load_next = true;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
        $scope.$on("AnimationPlay", function () {
            _this.onAnimationPlay();
        });
        $scope.$on("AnimationPause", function () {
        });
        $scope.$on("AnimationStop", function () {
            _this.onAnimationStop();
        });
        $scope.$on("AnimationNext", function () {
            _this.onAnimationPlay(false, true);
        });
        $scope.$on("AnimationPrevious", function () {
            _this.onAnimationPlay(true, true);
        });
    }
    FrameEditorController.prototype.onAnimationPlay = function (reverse, once) {
        var _this = this;
        if (reverse === void 0) { reverse = false; }
        if (once === void 0) { once = false; }
        var now_frame_index = this.motion.getSelectedFrameIndex();
        var now_frame = this.motion.frames[now_frame_index];
        if (reverse) {
            var next_frame_index = now_frame_index - 1;
            var next_frame = (now_frame_index === 0) ? null : this.motion.frames[next_frame_index];
        }
        else {
            var next_frame_index = now_frame_index + 1;
            var next_frame = (now_frame_index + 1 === this.motion.frames.length) ? null : this.motion.frames[next_frame_index];
        }
        if (_.isNull(next_frame)) {
            this.$rootScope.$broadcast("ComponentEnabled");
            return;
        }
        this.load_next = !once;
        var frame_count = Math.ceil(next_frame.transition_time_ms / (1000 / FrameEditorController.FPS));
        this.outputs_backup = [];
        this.animation_diffs = [];
        _.each(now_frame.outputs, function (output, index) {
            _this.outputs_backup.push(output.value);
            _this.animation_diffs.push((next_frame.outputs[index].value - output.value) / frame_count);
        });
        this.animation_promise = this.$interval(function () {
            _.each(_this.animation_diffs, function (animation_diff, index) {
                now_frame.outputs[index].value += animation_diff;
            });
            _this.$rootScope.$broadcast("FrameLoad", now_frame_index);
        }, (1000 / FrameEditorController.FPS), frame_count).catch(function () {
            console.log("abort");
            _this.load_next = false;
        }).finally(function () {
            _.each(now_frame.outputs, function (output, index) {
                output.value = _this.outputs_backup[index];
            });
            _this.motion.selectFrame(next_frame_index, false);
            if (_this.load_next) {
                _this.onAnimationPlay(reverse);
            }
            else {
                _this.$rootScope.$broadcast("ComponentEnabled");
            }
        });
    };
    FrameEditorController.prototype.onAnimationStop = function () {
        this.load_next = false;
    };
    FrameEditorController.prototype.onClick = function ($event) {
        if ($event.target.id === "frame_editor") {
            var offset_x;
            if (_.isUndefined($event.offsetX)) {
                offset_x = $event.pageX - $($event.target).offset().left;
            }
            else {
                offset_x = $event.offsetX;
            }
            var insert_pos = Math.floor(offset_x / 173);
            if (insert_pos > this.motion.frames.length) {
                this.motion.addFrame(this.motion.frames.length);
            }
            else {
                this.motion.addFrame(insert_pos);
            }
        }
    };
    FrameEditorController.$inject = [
        "$scope",
        "$rootScope",
        "$q",
        "$interval",
        "SharedMotionService"
    ];
    FrameEditorController.FPS = 30;
    return FrameEditorController;
})();
var FrameEditorDirective = (function () {
    function FrameEditorDirective() {
    }
    FrameEditorDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: FrameEditorController,
            controllerAs: "frame_editor",
            scope: {},
            templateUrl: "./angularjs/components/FrameEditor/view.html"
        };
    };
    return FrameEditorDirective;
})();
angular.module(app_name).directive("frameEditor", [
    FrameEditorDirective.getDDO
]);
"use strict";
var GoogleplusButtonController = (function () {
    function GoogleplusButtonController($window) {
        this.$window = $window;
        this.href = "https://plus.google.com/share?url=http://plen.jp/playground/motion-editor/";
    }
    GoogleplusButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), "googleplus_window", "width=650, height=450, menubar=no, toolbar=no, location=no, scrollbars=yes, sizable=yes");
    };
    GoogleplusButtonController.$inject = ["$window"];
    return GoogleplusButtonController;
})();
function GoogleplusButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: GoogleplusButtonController,
        controllerAs: "googleplus_button",
        scope: {},
        templateUrl: "./angularjs/components/GoogleplusButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("googleplusButton", GoogleplusButtonDirective);
"use strict";
var InstallButtonController = (function () {
    function InstallButtonController($window, $scope) {
        var _this = this;
        this.$window = $window;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    InstallButtonController.prototype.onClick = function () {
        this.$window.alert("現在未実装の機能です。");
    };
    InstallButtonController.$inject = [
        "$window",
        "$scope"
    ];
    return InstallButtonController;
})();
function InstallButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: InstallButtonController,
        controllerAs: "install_button",
        scope: {},
        templateUrl: "./angularjs/components/InstallButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("installButton", InstallButtonDirective);
"use strict";
var ThreeModel = (function () {
    function ThreeModel() {
        this.home_quaternions = [];
        this.rotation_axes = [];
        this.not_axes = [];
    }
    ThreeModel.prototype.init = function ($element, layout) {
        this.layout = layout;
        var width = this.layout.width();
        var height = this.layout.height();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(200, 200, 500);
        this.grid = new THREE.GridHelper(1000, 100);
        this.grid.position.set(0, 0, 0);
        this.grid.setColors(0xB2DB11, 0xFFFFFF);
        this.scene.add(this.grid);
        this.light = new THREE.SpotLight(0xCCCCCC);
        this.light.position.set(1000, 1000, 1000);
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
    };
    ThreeModel.prototype.reset = function () {
        var _this = this;
        _.each(this.rotation_axes, function (axis, index) {
            axis.quaternion.copy(_this.home_quaternions[index]);
        });
    };
    ThreeModel.prototype.resize = function () {
        var width = this.layout.width();
        var height = this.layout.height();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };
    ThreeModel.prototype.animate = function () {
        var _this = this;
        this.refresh();
        requestAnimationFrame(function () {
            _this.animate();
        });
    };
    ThreeModel.prototype.refresh = function () {
        this.orbit_controls.update();
        this.transform_controls.update();
        this.renderer.render(this.scene, this.camera);
    };
    ThreeModel.prototype.intersect = function (screen_x, screen_y) {
        var _this = this;
        var rect = this.renderer.domElement.getBoundingClientRect();
        var x = (screen_x - rect.left) / rect.width;
        var y = (screen_y - rect.top) / rect.height;
        var pointer_vector = new THREE.Vector3((x * 2) - 1, -(y * 2) + 1, 0.5);
        pointer_vector.unproject(this.camera);
        var ray = new THREE.Raycaster(this.camera.getWorldPosition(), pointer_vector.sub(this.camera.getWorldPosition()).normalize());
        var intersections = ray.intersectObjects(this.not_axes, true);
        if (intersections[0]) {
            this.transform_controls.detach();
            _.each(this.rotation_axes, function (axis) {
                if (axis === intersections[0].object.parent) {
                    _this.transform_controls.attach(axis);
                    _this.orbit_controls.enabled = false;
                    return false;
                }
                else {
                    _this.orbit_controls.enabled = true;
                }
            });
        }
        else {
            this.transform_controls.detach();
            this.orbit_controls.enabled = true;
        }
    };
    return ThreeModel;
})();
"use strict";
var ThreeFactory = (function () {
    function ThreeFactory() {
    }
    ThreeFactory.prototype.getThree = function () {
        return new ThreeModel();
    };
    return ThreeFactory;
})();
angular.module(app_name).service("ThreeFactory", ThreeFactory);
"use strict";
var ModelEditorController = (function () {
    function ModelEditorController($scope, model_loader, three_factory, motion, image_store_service) {
        var _this = this;
        this.model_loader = model_loader;
        this.motion = motion;
        this.image_store_service = image_store_service;
        this.disabled = false;
        this.three_model = three_factory.getThree();
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
        $scope.$on("ModelEditorUnfocused", function () {
            _this.onModelEditorUnfocused();
        });
        $scope.$on("3DModelLoaded", function () {
            _this.on3DModelLoaded();
        });
        $scope.$on("3DModelReset", function () {
            _this.on3DModelReset();
        });
        $scope.$on("FrameSave", function (event, frame_index) {
            _this.onFrameSave(frame_index);
        });
        $scope.$on("FrameLoad", function (event, frame_index) {
            _this.onFrameLoad(frame_index);
        });
    }
    ModelEditorController.prototype.onModelEditorUnfocused = function () {
        this.three_model.transform_controls.detach();
        this.three_model.orbit_controls.enabled = true;
    };
    ModelEditorController.prototype.on3DModelLoaded = function () {
        this.setImage();
        this.three_model.home_quaternions = this.model_loader.home_quaternions;
        this.three_model.rotation_axes = this.model_loader.rotation_axes;
        this.three_model.not_axes = this.model_loader.not_axes;
    };
    ModelEditorController.prototype.on3DModelReset = function () {
        this.three_model.reset();
        this.setImage();
    };
    ModelEditorController.prototype.onFrameSave = function (frame_index) {
        var _this = this;
        this.motion.frames[frame_index].outputs = [];
        _.each(this.three_model.rotation_axes, function (axis, index) {
            var home_quaternion = _this.three_model.home_quaternions[index].clone();
            var axis_quaternion = axis.quaternion.clone();
            var target_quaternion = home_quaternion.inverse().multiply(axis_quaternion);
            var theta_half_diff = Math.atan2(target_quaternion.y, target_quaternion.w);
            if (Math.abs(theta_half_diff * 2) > Math.PI) {
                var theta_diff = 2 * Math.PI - Math.abs(theta_half_diff * 2);
                if (theta_half_diff > 0) {
                    theta_diff *= -1;
                }
            }
            else {
                var theta_diff = theta_half_diff * 2;
            }
            _this.motion.frames[frame_index].outputs.push(new OutputDeviceModel(axis.name, theta_diff * 1800 / Math.PI));
        });
    };
    ModelEditorController.prototype.onFrameLoad = function (frame_index) {
        var _this = this;
        if (_.isEmpty(this.motion.frames[frame_index].outputs)) {
            this.three_model.reset();
            this.setImage();
        }
        else {
            _.each(this.motion.frames[frame_index].outputs, function (output, index) {
                var theta_diff = output.value * Math.PI / 1800;
                var home_quaternion = _this.three_model.home_quaternions[index].clone();
                var target_quaternion = new THREE.Quaternion();
                target_quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), theta_diff);
                home_quaternion.multiply(target_quaternion);
                _this.three_model.rotation_axes[index].quaternion.copy(home_quaternion);
            });
        }
        if (_.isEmpty(this.motion.frames[frame_index].image_uri)) {
            this.setImage();
        }
    };
    ModelEditorController.prototype.onClick = function ($event) {
        if (!this.disabled) {
            this.intersect($event);
        }
        this.setImage();
    };
    ModelEditorController.prototype.setImage = function () {
        this.three_model.refresh();
        var image = this.three_model.renderer.domElement;
        this.image_store_service.set(image);
        var selected_frame = _.find(this.motion.frames, function (frame) {
            return frame.selected;
        });
        selected_frame.image_uri = this.image_store_service.get();
    };
    ModelEditorController.prototype.intersect = function ($event) {
        if ($event.type !== "click") {
            this.three_model.transform_controls.detach();
            this.three_model.orbit_controls.enabled = true;
            return;
        }
        this.three_model.intersect($event.clientX, $event.clientY);
    };
    ModelEditorController.$inject = [
        "$scope",
        "ModelLoaderService",
        "ThreeFactory",
        "SharedMotionService",
        "ImageStoreService"
    ];
    return ModelEditorController;
})();
"use strict";
var ModelLoader = (function () {
    function ModelLoader($rootScope, $http) {
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.home_quaternions = [];
        this.rotation_axes = [];
        this.not_axes = [];
    }
    ModelLoader.prototype.addRotationAxis = function (object) {
        var _this = this;
        if (/roll/.test(object.name)) {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/pitch/.test(object.name)) {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/yaw/.test(object.name)) {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else {
            this.not_axes.push(object);
        }
        if (object.children.length > 0) {
            _.each(object.children, function (child) {
                _this.addRotationAxis(child);
            });
        }
    };
    ModelLoader.prototype.addObject = function (object) {
        this.scene.add(object);
        this.addRotationAxis(object);
    };
    ModelLoader.prototype.setScene = function (scene) {
        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;
        while (scene.children.length > 0) {
            this.addObject(scene.children[0]);
        }
    };
    ModelLoader.prototype.getAxisMap = function () {
        var axis_map = {};
        _.each(this.rotation_axes, function (rotation_axis, index) {
            axis_map[rotation_axis.name] = index;
        });
        return axis_map;
    };
    ModelLoader.prototype.loadJSON = function () {
        var _this = this;
        this.$http.get("./assets/etc/plen_model.min.json").success(function (data) {
            var model_obj = data;
            if (model_obj.metadata.type.toLowerCase() === "object") {
                var loader = new THREE.ObjectLoader();
                var result = loader.parse(model_obj);
                if (result instanceof THREE.Scene) {
                    _this.setScene(result);
                }
                else {
                    _this.addObject(result);
                }
                _this.$rootScope.$broadcast("3DModelLoaded");
            }
        }).error(function () {
            alert("3Dモデルの読み込みに失敗しました。");
        });
    };
    return ModelLoader;
})();
"use strict";
angular.module(app_name).service("ModelLoaderService", [
    "$rootScope",
    "$http",
    ModelLoader
]);
"use strict";
var ModelEditorDirective = (function () {
    function ModelEditorDirective() {
    }
    ModelEditorDirective.getDDO = function ($rootScope, $window, model_loader) {
        return {
            restrict: "E",
            controller: ModelEditorController,
            controllerAs: "model_editor",
            replace: true,
            templateUrl: "./angularjs/components/ModelEditor/view.html",
            link: {
                pre: function (scope) {
                    scope.model_editor.layout = {
                        width: function () {
                            return $window.innerWidth - ModelEditorDirective.width_offset;
                        },
                        height: function () {
                            return $window.innerHeight - ModelEditorDirective.height_offset;
                        },
                        resizeFook: function (element) {
                            scope.model_editor.three_model.resize();
                        }
                    };
                    scope.model_editor.three_model.init($("#canvas_wrapper"), scope.model_editor.layout);
                    scope.model_editor.three_model.animate();
                    $("body").on("click", function (event) {
                        if (event.target !== scope.model_editor.three_model.renderer.domElement) {
                            $rootScope.$broadcast("ModelEditorUnfocused");
                        }
                    });
                    $("#canvas_wrapper canvas").on("touchend", function (event) {
                        scope.model_editor.onClick(event);
                        scope.$apply();
                    });
                    model_loader.scene = scope.model_editor.three_model.scene;
                    model_loader.loadJSON();
                }
            }
        };
    };
    ModelEditorDirective.width_offset = 240 + 45;
    ModelEditorDirective.height_offset = 186 + 40;
    return ModelEditorDirective;
})();
angular.module(app_name).directive("modelEditor", [
    "$rootScope",
    "$window",
    "ModelLoaderService",
    ModelEditorDirective.getDDO
]);
"use strict";
var NewButtonController = (function () {
    function NewButtonController($rootScope, $scope, $window, motion) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.motion = motion;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    NewButtonController.prototype.click = function () {
        var result = this.$window.confirm("本当に新規にモーションを作成しますか？\n\n" + "現在の作業内容が破棄されます。\n" + '保存がまだの場合は"キャンセル"をクリックしてください。');
        if (result === true) {
            this.motion.reset();
            this.$rootScope.$broadcast("3DModelReset");
        }
    };
    NewButtonController.$inject = [
        "$rootScope",
        "$scope",
        "$window",
        "SharedMotionService"
    ];
    return NewButtonController;
})();
function NewButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: NewButtonController,
        controllerAs: "new_button",
        scope: {},
        templateUrl: "./angularjs/components/NewButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("newButton", NewButtonDirective);
"use strict";
var NextButtonController = (function () {
    function NextButtonController($rootScope, motion_model, $scope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.motion_model = motion_model;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    NextButtonController.prototype.onClick = function () {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.$rootScope.$broadcast("AnimationNext");
    };
    NextButtonController.$inject = [
        "$rootScope",
        "SharedMotionService",
        "$scope"
    ];
    return NextButtonController;
})();
function NextButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: NextButtonController,
        controllerAs: "next_button",
        scope: {},
        templateUrl: "./angularjs/components/NextButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("nextButton", NextButtonDirective);
"use strict";
var OpenButtonController = (function () {
    function OpenButtonController($scope, motion) {
        var _this = this;
        this.motion = motion;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    OpenButtonController.$inject = [
        "$scope",
        "SharedMotionService"
    ];
    return OpenButtonController;
})();
function OpenButtonDirective(model_loader) {
    "use strict";
    return {
        restrict: "E",
        controller: OpenButtonController,
        controllerAs: "open_button",
        scope: {},
        templateUrl: "./angularjs/components/OpenButton/view.html",
        replace: true,
        link: function (scope, element, attrs) {
            $(element[0].children[1]).on("change", function (event) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    scope.open_button.motion.loadJSON(event.target.result, model_loader.getAxisMap());
                    scope.$apply();
                };
                reader.readAsText(event.target.files[0]);
            });
        }
    };
}
angular.module(app_name).directive("openButton", [
    "ModelLoaderService",
    OpenButtonDirective
]);
"use strict";
var PlayButtonController = (function () {
    function PlayButtonController($scope, $rootScope, motion_model) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.motion_model = motion_model;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    PlayButtonController.prototype.onClick = function () {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.$rootScope.$broadcast("AnimationPlay");
    };
    PlayButtonController.$inject = [
        "$scope",
        "$rootScope",
        "SharedMotionService"
    ];
    return PlayButtonController;
})();
function PlayButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: PlayButtonController,
        controllerAs: 'play_button',
        scope: {},
        templateUrl: "./angularjs/components/PlayButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("playButton", PlayButtonDirective);
"use strict";
var PreviousButtonController = (function () {
    function PreviousButtonController($scope, motion_model, $rootScope) {
        var _this = this;
        this.motion_model = motion_model;
        this.$rootScope = $rootScope;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    PreviousButtonController.prototype.onClick = function () {
        this.$rootScope.$broadcast("ComponentDisabled");
        this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
        this.$rootScope.$broadcast("AnimationPrevious");
    };
    PreviousButtonController.$inject = [
        "$scope",
        "SharedMotionService",
        "$rootScope"
    ];
    return PreviousButtonController;
})();
function PreviousButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: PreviousButtonController,
        controllerAs: "previous_button",
        scope: {},
        templateUrl: "./angularjs/components/PreviousButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("previousButton", PreviousButtonDirective);
"use strict";
var ResetButtonController = (function () {
    function ResetButtonController($scope, $rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    ResetButtonController.prototype.click = function () {
        this.$rootScope.$broadcast("3DModelReset");
    };
    ResetButtonController.$inject = [
        "$scope",
        "$rootScope"
    ];
    return ResetButtonController;
})();
function ResetButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: ResetButtonController,
        controllerAs: "reset_button",
        scope: {},
        templateUrl: "./angularjs/components/ResetButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("resetButton", ResetButtonDirective);
"use strict";
var SaveButtonController = (function () {
    function SaveButtonController($rootScope, $scope, $element, motion) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$element = $element;
        this.motion = motion;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
        $element.on("touchstart", function () {
            _this.onClick();
        });
    }
    SaveButtonController.prototype.onClick = function () {
        if (!this.disabled) {
            this.$rootScope.$broadcast("FrameSave", this.motion.getSelectedFrameIndex());
            this.setDownloadLink();
        }
    };
    SaveButtonController.prototype.setDownloadLink = function () {
        var _this = this;
        var json_blob = new Blob([this.motion.saveJSON()], { type: "text/plain" });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(json_blob, this.motion.name + ".json");
        }
        else {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.$element[0].href = reader.result;
            };
            reader.readAsDataURL(json_blob);
        }
    };
    SaveButtonController.$inject = [
        "$rootScope",
        "$scope",
        "$element",
        "SharedMotionService"
    ];
    return SaveButtonController;
})();
function SaveButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: SaveButtonController,
        controllerAs: "save_button",
        scope: {},
        templateUrl: "./angularjs/components/SaveButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("saveButton", SaveButtonDirective);
"use strict";
var ScrollableContainerDirective = (function () {
    function ScrollableContainerDirective() {
    }
    ScrollableContainerDirective.getDDO = function ($window) {
        return {
            restrict: "A",
            controller: function () {
            },
            controllerAs: "scrollable_container",
            template: "<div ng-transclude/>",
            transclude: true,
            link: function (scope) {
                scope.scrollable_container.layout = {
                    width: function () {
                        return $window.innerWidth - ScrollableContainerDirective.width_offset;
                    },
                    height: function () {
                        return 158;
                    },
                    resizeFook: function () {
                    }
                };
            }
        };
    };
    ScrollableContainerDirective.width_offset = 240;
    return ScrollableContainerDirective;
})();
angular.module(app_name).directive("scrollableContainer", [
    "$window",
    ScrollableContainerDirective.getDDO
]);
"use strict";
var StopButtonController = (function () {
    function StopButtonController($rootScope) {
        this.$rootScope = $rootScope;
    }
    StopButtonController.prototype.onClick = function () {
        this.$rootScope.$broadcast("AnimationStop");
    };
    StopButtonController.$inject = [
        "$rootScope"
    ];
    return StopButtonController;
})();
function StopButtonDirective() {
    "use strict";
    return {
        restrict: 'E',
        controller: StopButtonController,
        controllerAs: 'stop_button',
        scope: {},
        templateUrl: "./angularjs/components/StopButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("stopButton", StopButtonDirective);
"use strict";
var SyncButtonController = (function () {
    function SyncButtonController($scope, $window) {
        var _this = this;
        this.$window = $window;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    SyncButtonController.prototype.click = function () {
        this.$window.alert("現在未実装の機能です。");
    };
    SyncButtonController.$inject = [
        "$scope",
        "$window"
    ];
    return SyncButtonController;
})();
function SyncButtonDirective() {
    "use strict";
    return {
        restrict: "E",
        controller: SyncButtonController,
        controllerAs: "sync_button",
        scope: {},
        templateUrl: "./angularjs/components/SyncButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("syncButton", SyncButtonDirective);
"use strict";
var TwitterButtonController = (function () {
    function TwitterButtonController($window) {
        this.$window = $window;
        this.href = "http://twitter.com/share?text=あなた好みにPLENを動かそう！「PLEN - Motion Editor for Web.」は、誰でも簡単にPLENのモーションを作成できるwebアプリです。&url=http://plen.jp/playground/motion-editor/&hashtags=PLEN";
    }
    TwitterButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), 'tweeter_window', 'width=650, height=470, menubar=no, toolbar=no, location=no, scrollbars=yes, sizable=yes');
    };
    TwitterButtonController.$inject = ['$window'];
    return TwitterButtonController;
})();
function TwitterButtonDirective() {
    "use strict";
    return {
        restrict: 'E',
        controller: TwitterButtonController,
        controllerAs: 'twitter_button',
        scope: {},
        templateUrl: "./angularjs/components/TwitterButton/view.html",
        replace: true
    };
}
angular.module(app_name).directive("twitterButton", TwitterButtonDirective);
"use strict";
var AutoResizeDirective = (function () {
    function AutoResizeDirective() {
    }
    AutoResizeDirective.getDDO = function ($window, $timeout) {
        return {
            restrict: "A",
            scope: {
                layout: "&autoResizeLayout",
                onload: "&autoResizeOnload"
            },
            link: function (scope, element) {
                if (scope.onload() === true) {
                    element.width(scope.layout().width());
                    element.height(scope.layout().height());
                    scope.layout().resizeFook(element);
                }
                var resize_promise = false;
                $window.addEventListener("resize", function () {
                    if (resize_promise !== false) {
                        $timeout.cancel(resize_promise);
                    }
                    resize_promise = $timeout(function () {
                        element.width(scope.layout().width());
                        element.height(scope.layout().height());
                        scope.layout().resizeFook(element);
                    }, 100, false);
                });
            }
        };
    };
    return AutoResizeDirective;
})();
angular.module(app_name).directive("autoResize", [
    "$window",
    "$timeout",
    AutoResizeDirective.getDDO
]);
//# sourceMappingURL=bundle.js.map