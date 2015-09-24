"use strict";
var APP_NAME = "PLEN2MotionEditorForWeb";
angular.module(APP_NAME, ["ngAnimate", "ui.sortable", "ui.bootstrap"]);
var DiffAngleViewerController = (function () {
    function DiffAngleViewerController(three_model) {
        this.three_model = three_model;
        this.name = "none";
        this.diff_angle = 0;
    }
    DiffAngleViewerController.prototype.onAngleChange = function () {
        this.name = this.three_model.transform_controls.object.name;
        this.diff_angle = this.three_model.getDiffAngle(this.three_model.transform_controls.object) / 10;
    };
    DiffAngleViewerController.$inject = [
        "SharedThreeService"
    ];
    return DiffAngleViewerController;
})();
var DiffAngleViewerDirective = (function () {
    function DiffAngleViewerDirective() {
    }
    DiffAngleViewerDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: DiffAngleViewerController,
            controllerAs: "diff_angle_viewer",
            scope: {},
            templateUrl: "./angularjs/components/DiffAngleViewer/view.html",
            replace: true,
            link: function ($scope) {
                $("body").on("angleChange", function () {
                    $scope.diff_angle_viewer.onAngleChange();
                    $scope.$apply();
                });
            }
        };
    };
    return DiffAngleViewerDirective;
})();
angular.module(APP_NAME).directive("diffAngleViewer", [
    DiffAngleViewerDirective.getDDO
]);
var EditPropertiesButtonController = (function () {
    function EditPropertiesButtonController($scope, $modal) {
        var _this = this;
        this.$modal = $modal;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    EditPropertiesButtonController.prototype.onClick = function () {
        var modal = this.$modal.open({
            controller: EditPropertiesModalController,
            controllerAs: "modal",
            templateUrl: "./angularjs/components/EditPropertiesModal/view.html",
            backdrop: 'static',
            keyboard: false
        });
    };
    EditPropertiesButtonController.$inject = [
        "$scope",
        "$modal"
    ];
    return EditPropertiesButtonController;
})();
var EditPropertiesButtonDirective = (function () {
    function EditPropertiesButtonDirective() {
    }
    EditPropertiesButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: EditPropertiesButtonController,
            controllerAs: "edit_properties_button",
            scope: {},
            templateUrl: "./angularjs/components/EditPropertiesButton/view.html",
            replace: true
        };
    };
    return EditPropertiesButtonDirective;
})();
angular.module(APP_NAME).directive("editPropertiesButton", [
    EditPropertiesButtonDirective.getDDO
]);
var EditPropertiesModalController = (function () {
    function EditPropertiesModalController($modalInstance, motion) {
        var _this = this;
        this.$modalInstance = $modalInstance;
        this.motion = motion;
        this.loop_options = {
            use: false,
            args: [0, 0, 255]
        };
        this.jump_options = {
            use: false,
            args: [0]
        };
        _.each(this.motion.codes, function (code) {
            if (code.func == "loop") {
                _this.loop_options.use = true;
                _this.loop_options.args = code.args;
            }
            if (code.func == "jump") {
                _this.jump_options.use = true;
                _this.jump_options.args = code.args;
            }
        });
    }
    EditPropertiesModalController.prototype.ok = function () {
        try {
            if (_.isUndefined(this.motion.slot)) {
                throw "Slot: Please fill the property. (Required value is between 0 to 89.)";
            }
            if ((this.motion.name.length > 20) || (!/^[\w\s]+$/.test(this.motion.name))) {
                throw "Name: Required format is half-width alphanumerics and length is 20 bytes or less.";
            }
            if (this.loop_options.use) {
                if ((_.isUndefined(this.loop_options.args[0])) || (this.loop_options.args[0] > this.loop_options.args[1])) {
                    var max = this.loop_options.args[1];
                    throw "Loop function - Begin: Please fill the propertie. (Required value is between 0 to " + max.toString() + ".)";
                }
                if ((_.isUndefined(this.loop_options.args[1])) || (this.loop_options.args[1] < this.loop_options.args[0]) || (this.loop_options.args[1] >= this.motion.frames.length)) {
                    var min = this.loop_options.args[0];
                    var max = this.motion.frames.length - 1;
                    throw "Loop function - End: Please fill the propertie. (Required value is between " + min.toString() + " to " + max.toString() + ".)";
                }
                if (_.isUndefined(this.loop_options.args[2])) {
                    throw "Loop function - Count: Please fill the propertie. (Required value is between 1 to 255.)";
                }
            }
            if (this.jump_options.use) {
                if (_.isUndefined(this.jump_options.args[0])) {
                    throw "Jump function - Slot: Please fill the propertie. (Required value is between 0 to 89.)";
                }
            }
        }
        catch (exception) {
            alert(exception);
            return;
        }
        this.motion.codes = [];
        if (this.loop_options.use) {
            this.motion.codes.push(new CodeModel("loop", this.loop_options.args));
        }
        if (this.jump_options.use) {
            this.motion.codes.push(new CodeModel("jump", this.jump_options.args));
        }
        this.$modalInstance.close();
    };
    EditPropertiesModalController.$inject = [
        "$modalInstance",
        "SharedMotionService"
    ];
    return EditPropertiesModalController;
})();
var FacebookButtonController = (function () {
    function FacebookButtonController($window) {
        this.$window = $window;
        this.href = "http://www.facebook.com/share.php?u=http://plen.jp/playground/motion-editor/";
    }
    FacebookButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), "facebook_window", "width=650,height=470,menubar=no,toolbar=no,location=no,scrollbars=yes,sizable=no");
    };
    FacebookButtonController.$inject = [
        "$window"
    ];
    return FacebookButtonController;
})();
var FacebookButtonDirective = (function () {
    function FacebookButtonDirective() {
    }
    FacebookButtonDirective.getDDO = function () {
        return {
            restrict: 'E',
            controller: FacebookButtonController,
            controllerAs: 'facebook_button',
            scope: {},
            templateUrl: "./angularjs/components/FacebookButton/view.html",
            replace: true
        };
    };
    return FacebookButtonDirective;
})();
angular.module(APP_NAME).directive("facebookButton", [
    FacebookButtonDirective.getDDO
]);
"use strict";
var CodeModel = (function () {
    function CodeModel(func, args) {
        this.func = func;
        this.args = args;
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
var MotionModel = (function () {
    function MotionModel($rootScope, frame_factory) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.frame_factory = frame_factory;
        this.slot = 44;
        this.name = "Empty";
        this.codes = [];
        this.frames = [];
        this.frames.push(this.frame_factory.getFrame());
        $(window).on("beforeunload", function () {
            _this.$rootScope.$broadcast("FrameSave", _this.getSelectedFrameIndex());
            localStorage.setItem("motion", _this.saveJSON());
        });
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
        this.name = "Empty";
        this.slot = 44;
        this.codes = [];
        this.frames = [this.frame_factory.getFrame()];
        this.$rootScope.$broadcast("FrameLoad", 0);
    };
    MotionModel.prototype.loadJSON = function (motion_json, axis_map) {
        var _this = this;
        try {
            var motion_obj = JSON.parse(motion_json);
            if (_.isUndefined(motion_obj.slot) || !_.isNumber(motion_obj.slot)) {
                throw "Bad format!";
            }
            if (_.isUndefined(motion_obj.name) || !_.isString(motion_obj.name)) {
                throw "Bad format!";
            }
            if (_.isUndefined(motion_obj.codes) || !_.isArray(motion_obj.codes)) {
                throw "Bad format!";
            }
            _.each(motion_obj.codes, function (code) {
                if (_.isUndefined(code.func) || !_.isString(code.func)) {
                    throw "Bad format!";
                }
                if (_.isUndefined(code.args) || !_.isArray(code.args)) {
                    throw "Bad format!";
                }
                else {
                    _.each(code.args, function (argment) {
                        if (!_.isNumber(argment)) {
                            throw "Bad format!";
                        }
                    });
                }
            });
            if (_.isUndefined(motion_obj.frames) || !_.isArray(motion_obj.frames)) {
                throw "Bad format!";
            }
            else {
                _.each(motion_obj.frames, function (frame) {
                    if (_.isUndefined(frame.transition_time_ms) || !_.isNumber(frame.transition_time_ms)) {
                        throw "Bad format!";
                    }
                    if (_.isUndefined(frame.outputs) || !_.isArray(frame.outputs)) {
                        throw "Bad format!";
                    }
                    else {
                        _.each(frame.outputs, function (output) {
                            if (_.isUndefined(output.device) || !_.isString(output.device)) {
                                throw "Bad format!";
                            }
                            if (_.isUndefined(output.value) || !_.isNumber(output.value)) {
                                throw "Bad format!";
                            }
                        });
                    }
                });
            }
            this.slot = motion_obj.slot;
            this.name = motion_obj.name;
            this.codes = [];
            _.each(motion_obj.codes, function (code) {
                var args = [];
                _.each(code.args, function (argment) {
                    args.push(argment);
                });
                _this.codes.push(new CodeModel(code.func, args));
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
            alert("Loading a motion file failed. This file has invalid format.");
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
var ImageStoreService = (function () {
    function ImageStoreService() {
        this._image_canvas = document.createElement("canvas");
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
angular.module(APP_NAME).service("ImageStoreService", ImageStoreService);
var FrameFactory = (function () {
    function FrameFactory(image_store_service) {
        this.image_store_service = image_store_service;
    }
    FrameFactory.prototype.getFrame = function (selected) {
        if (selected === void 0) { selected = true; }
        return new FrameModel(500, [], selected, this.image_store_service.get());
    };
    FrameFactory.$inject = [
        "ImageStoreService"
    ];
    return FrameFactory;
})();
angular.module(APP_NAME).service("FrameFactory", FrameFactory);
angular.module(APP_NAME).service("SharedMotionService", [
    "$rootScope",
    "FrameFactory",
    MotionModel
]);
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
        var theta = Math.atan2(this.camera.position.x, this.camera.position.z);
        var phi = Math.atan2(Math.sqrt(this.camera.position.x * this.camera.position.x + this.camera.position.z * this.camera.position.z), this.camera.position.y);
        var radius = Math.sqrt(3) * 1000;
        this.light.position.x = radius * Math.sin(phi) * Math.sin(theta);
        this.light.position.y = radius * Math.cos(phi);
        this.light.position.z = radius * Math.sin(phi) * Math.cos(theta);
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
        var result = false;
        if (intersections[0]) {
            _.each(this.rotation_axes, function (axis) {
                if (axis === intersections[0].object.parent) {
                    _this.transform_controls.attach(axis);
                    _this.orbit_controls.enabled = false;
                    result = true;
                    return false;
                }
                else {
                    _this.orbit_controls.enabled = true;
                }
            });
        }
        return result;
    };
    ThreeModel.prototype.reverse3DModel = function () {
        var length_half = this.rotation_axes.length / 2;
        for (var index = 0; index < length_half; index++) {
            var angle_diff_rhs = this.getDiffAngle(this.rotation_axes[index], index);
            var angle_diff_lhs = this.getDiffAngle(this.rotation_axes[length_half + index], length_half + index);
            this.setDiffAngle(this.rotation_axes[index], -angle_diff_lhs, index);
            this.setDiffAngle(this.rotation_axes[length_half + index], -angle_diff_rhs, length_half + index);
        }
    };
    ThreeModel.prototype.copyRightToLeft = function () {
        var length_half = this.rotation_axes.length / 2;
        for (var index = 0; index < length_half; index++) {
            var angle_diff_rhs = this.getDiffAngle(this.rotation_axes[index], index);
            this.setDiffAngle(this.rotation_axes[length_half + index], -angle_diff_rhs, length_half + index);
        }
    };
    ThreeModel.prototype.copyLeftToRight = function () {
        var length_half = this.rotation_axes.length / 2;
        for (var index = 0; index < length_half; index++) {
            var angle_diff_lhs = this.getDiffAngle(this.rotation_axes[length_half + index], length_half + index);
            this.setDiffAngle(this.rotation_axes[index], -angle_diff_lhs, index);
        }
    };
    ThreeModel.prototype.getDiffAngle = function (axis_object, index) {
        if (index === void 0) { index = null; }
        var angle_diff = null;
        if (!_.isUndefined(axis_object)) {
            if (_.isNull(index)) {
                index = _.findIndex(this.rotation_axes, function (axis) {
                    return axis === axis_object;
                });
            }
            var home_quaternion = this.home_quaternions[index].clone();
            var axis_quaternion = this.rotation_axes[index].quaternion.clone();
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
            angle_diff = Math.round(theta_diff * 1800 / Math.PI);
        }
        return angle_diff;
    };
    ThreeModel.prototype.setDiffAngle = function (axis_object, angle_diff, index) {
        if (index === void 0) { index = null; }
        var theta_diff = angle_diff * Math.PI / 1800;
        if (_.isNull(index)) {
            index = _.findIndex(this.rotation_axes, function (axis) {
                return axis === axis_object;
            });
        }
        var home_quaternion = this.home_quaternions[index].clone();
        var target_quaternion = new THREE.Quaternion();
        target_quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), theta_diff);
        home_quaternion.multiply(target_quaternion);
        this.rotation_axes[index].quaternion.copy(home_quaternion);
    };
    return ThreeModel;
})();
angular.module(APP_NAME).service("SharedThreeService", [
    ThreeModel
]);
var AnimationHelper = (function () {
    function AnimationHelper($rootScope, $interval, motion) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$interval = $interval;
        this.motion = motion;
        this._outputs_backup = [];
        this._angle_diffs = [];
        $rootScope.$on("AnimationPlay", function () {
            _this.onAnimationPlay();
        });
        $rootScope.$on("AnimationStop", function () {
            _this.onAnimationStop();
        });
        $rootScope.$on("AnimationPrevious", function () {
            var now_frame_index = _this.motion.getSelectedFrameIndex();
            if (now_frame_index !== 0) {
                _this.onAnimationPlayOnce(now_frame_index - 1);
            }
            else {
                $rootScope.$broadcast("ComponentEnabled");
            }
        });
        $rootScope.$on("AnimationNext", function () {
            var now_frame_index = _this.motion.getSelectedFrameIndex();
            if (now_frame_index !== (_this.motion.frames.length - 1)) {
                _this.onAnimationPlayOnce(now_frame_index + 1);
            }
            else {
                $rootScope.$broadcast("ComponentEnabled");
            }
        });
    }
    AnimationHelper.prototype.onAnimationPlayOnce = function (next_frame_index, continuous_callback) {
        var _this = this;
        if (continuous_callback === void 0) { continuous_callback = null; }
        var now_frame_index = this.motion.getSelectedFrameIndex();
        var now_frame = this.motion.frames[now_frame_index];
        var next_frame = this.motion.frames[next_frame_index];
        var transition_count = Math.ceil(next_frame.transition_time_ms / (1000 / AnimationHelper.FPS));
        this._outputs_backup = [];
        this._angle_diffs = [];
        _.each(now_frame.outputs, function (output, index) {
            _this._outputs_backup.push(output.value);
            _this._angle_diffs.push((next_frame.outputs[index].value - output.value) / transition_count);
        });
        this._animation_promise = this.$interval(function () {
            _.each(_this._angle_diffs, function (angle_diff, index) {
                now_frame.outputs[index].value += angle_diff;
            });
            _this.$rootScope.$broadcast("FrameLoad", now_frame_index);
        }, (1000 / AnimationHelper.FPS), transition_count);
        this._animation_promise.catch(function () {
            continuous_callback = null;
        });
        this._animation_promise.finally(function () {
            _.each(now_frame.outputs, function (output, index) {
                output.value = _this._outputs_backup[index];
            });
            _this.motion.selectFrame(next_frame_index, false);
            if (continuous_callback === null) {
                _this.$rootScope.$broadcast("ComponentEnabled");
            }
            else {
                continuous_callback();
            }
        });
    };
    AnimationHelper.prototype.onAnimationPlay = function () {
        var _this = this;
        var use_loop = false;
        var loop_begin = null;
        var loop_end = null;
        var loop_count = null;
        var loop_infinity = false;
        _.each(this.motion.codes, function (code) {
            if (code.func === "loop") {
                use_loop = true;
                loop_begin = code.args[0];
                loop_end = code.args[1];
                loop_count = code.args[2];
                if (loop_count === 255) {
                    loop_infinity = true;
                }
                return false;
            }
        });
        var callback = function () {
            var now_frame_index = _this.motion.getSelectedFrameIndex();
            if (use_loop && (now_frame_index === loop_end)) {
                if ((loop_count > 0) || loop_infinity) {
                    loop_count--;
                    _this.onAnimationPlayOnce(loop_begin, callback);
                    return;
                }
            }
            if (now_frame_index !== (_this.motion.frames.length - 1)) {
                _this.onAnimationPlayOnce(now_frame_index + 1, callback);
            }
            else {
                _this.$rootScope.$broadcast("ComponentEnabled");
            }
        };
        if (this.motion.getSelectedFrameIndex() !== 0) {
            this.onAnimationPlayOnce(0, callback);
        }
        else if (this.motion.frames.length > 1) {
            this.onAnimationPlayOnce(1, callback);
        }
        else {
            this.$rootScope.$broadcast("ComponentEnabled");
        }
    };
    AnimationHelper.prototype.onAnimationStop = function () {
        this.$interval.cancel(this._animation_promise);
    };
    AnimationHelper.$inject = [
        "$rootScope",
        "$interval",
        "SharedMotionService"
    ];
    AnimationHelper.FPS = 30;
    return AnimationHelper;
})();
angular.module(APP_NAME).service("AnimationHelperService", AnimationHelper);
var FrameEditorController = (function () {
    function FrameEditorController($scope, motion, animation_helper) {
        var _this = this;
        this.motion = motion;
        this.animation_helper = animation_helper;
        this.disabled = false;
        this.touch_disabled = 'ontouchend' in document;
        this.sortable_options = {
            axis: "x",
            scroll: false,
            revert: true
        };
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
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
        "SharedMotionService",
        "AnimationHelperService"
    ];
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
angular.module(APP_NAME).directive("frameEditor", [
    FrameEditorDirective.getDDO
]);
"use strict";
var GoogleplusButtonController = (function () {
    function GoogleplusButtonController($window) {
        this.$window = $window;
        this.href = "https://plus.google.com/share?url=http://plen.jp/playground/motion-editor/";
    }
    GoogleplusButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), "googleplus_window", "width=650,height=470,menubar=no,toolbar=no,location=no,scrollbars=yes,sizable=yes");
    };
    GoogleplusButtonController.$inject = ["$window"];
    return GoogleplusButtonController;
})();
var GoogleplusButtonDirective = (function () {
    function GoogleplusButtonDirective() {
    }
    GoogleplusButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: GoogleplusButtonController,
            controllerAs: "googleplus_button",
            scope: {},
            templateUrl: "./angularjs/components/GoogleplusButton/view.html",
            replace: true
        };
    };
    return GoogleplusButtonDirective;
})();
angular.module(APP_NAME).directive("googleplusButton", [
    GoogleplusButtonDirective.getDDO
]);
"use strict";
var InstallButtonController = (function () {
    function InstallButtonController(plen_controll_server_service, $scope, $rootScope, motion) {
        var _this = this;
        this.plen_controll_server_service = plen_controll_server_service;
        this.$rootScope = $rootScope;
        this.motion = motion;
        this.disabled = false;
        this.installing = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
        $scope.$on("InstallFinished", function () {
            _this.installing = false;
        });
    }
    InstallButtonController.prototype.onClick = function () {
        var _this = this;
        if (this.plen_controll_server_service.getStatus() === 0 /* DISCONNECTED */) {
            this.plen_controll_server_service.connect(function () {
                _this.onClick();
            });
        }
        if (this.plen_controll_server_service.getStatus() === 1 /* CONNECTED */) {
            var success_callback = function () {
                _this.plen_controll_server_service.play(_this.motion.slot, function () {
                    _this.$rootScope.$broadcast("ComponentDisabled");
                    _this.$rootScope.$broadcast("AnimationPlay");
                });
            };
            this.$rootScope.$broadcast("FrameSave", this.motion.getSelectedFrameIndex());
            this.plen_controll_server_service.install(JSON.parse(this.motion.saveJSON()), success_callback);
            this.installing = true;
        }
    };
    InstallButtonController.$inject = [
        "PLENControlServerService",
        "$scope",
        "$rootScope",
        "SharedMotionService"
    ];
    return InstallButtonController;
})();
var InstallButtonDirective = (function () {
    function InstallButtonDirective() {
    }
    InstallButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: InstallButtonController,
            controllerAs: "install_button",
            scope: {},
            templateUrl: "./angularjs/components/InstallButton/view.html",
            replace: true
        };
    };
    return InstallButtonDirective;
})();
angular.module(APP_NAME).directive("installButton", [
    InstallButtonDirective.getDDO
]);
var ModelEditorController = (function () {
    function ModelEditorController($scope, model_loader, three_model, motion, image_store_service) {
        var _this = this;
        this.model_loader = model_loader;
        this.three_model = three_model;
        this.motion = motion;
        this.image_store_service = image_store_service;
        this.disabled = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
        $scope.$on("3DModelLoaded", function () {
            _this.on3DModelLoaded();
        });
        $scope.$on("3DModelReset", function () {
            _this.on3DModelReset();
        });
        $scope.$on("RefreshThumbnail", function () {
            _this.onRefreshThumbnail();
        });
        $scope.$on("FrameSave", function (event, frame_index) {
            _this.onFrameSave(frame_index);
        });
        $scope.$on("FrameLoad", function (event, frame_index) {
            _this.onFrameLoad(frame_index);
        });
    }
    ModelEditorController.prototype.on3DModelLoaded = function () {
        this.setImage();
        this.three_model.home_quaternions = this.model_loader.home_quaternions;
        this.three_model.rotation_axes = this.model_loader.rotation_axes;
        this.three_model.not_axes = this.model_loader.not_axes;
        var json = localStorage.getItem("motion");
        if (!_.isNull(json)) {
            this.motion.loadJSON(json, this.model_loader.getAxisMap());
        }
    };
    ModelEditorController.prototype.on3DModelReset = function () {
        this.three_model.reset();
        this.setImage();
    };
    ModelEditorController.prototype.onRefreshThumbnail = function () {
        this.setImage();
    };
    ModelEditorController.prototype.onFrameSave = function (frame_index) {
        var _this = this;
        this.motion.frames[frame_index].outputs = [];
        _.each(this.three_model.rotation_axes, function (axis, index) {
            _this.motion.frames[frame_index].outputs.push(new OutputDeviceModel(axis.name, _this.three_model.getDiffAngle(axis, index)));
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
                _this.three_model.setDiffAngle(null, output.value, index);
            });
        }
        if (_.isEmpty(this.motion.frames[frame_index].image_uri)) {
            this.setImage();
        }
    };
    ModelEditorController.prototype.onFocus = function ($event) {
        if (this.disabled) {
            return;
        }
        if (!_.isUndefined($event.touches)) {
            if ($event.touches.length === 1) {
                var intersected = this.three_model.intersect($event.clientX, $event.clientY);
                if (intersected) {
                    this.three_model.transform_controls.$onPointerDown(event);
                }
            }
        }
        else {
            var intersected = this.three_model.intersect($event.clientX, $event.clientY);
            if (intersected) {
                this.three_model.transform_controls.$onPointerDown(event);
            }
        }
    };
    ModelEditorController.prototype.onUnfocus = function () {
        this.three_model.transform_controls.detach();
        this.three_model.orbit_controls.enabled = true;
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
    ModelEditorController.$inject = [
        "$scope",
        "ModelLoaderService",
        "SharedThreeService",
        "SharedMotionService",
        "ImageStoreService"
    ];
    return ModelEditorController;
})();
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
        if (/roll$/.test(object.name)) {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/pitch$/.test(object.name)) {
            this.rotation_axes.push(object);
            this.home_quaternions.push(object.quaternion.clone());
        }
        else if (/yaw$/.test(object.name)) {
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
        this.$http.get("./assets/etc/plen2_3dmodel.min.json").success(function (data) {
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
            alert("Loading a 3D model failed. (Please refresh this page.)");
        });
    };
    return ModelLoader;
})();
angular.module(APP_NAME).service("ModelLoaderService", [
    "$rootScope",
    "$http",
    ModelLoader
]);
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
                pre: function ($scope) {
                    $scope.model_editor.layout = {
                        width: function () {
                            return $window.innerWidth - ModelEditorDirective.width_offset;
                        },
                        height: function () {
                            return $window.innerHeight - ModelEditorDirective.height_offset;
                        },
                        resizeFook: function () {
                            $scope.model_editor.three_model.resize();
                        }
                    };
                    $scope.model_editor.three_model.init($("#canvas_wrapper"), $scope.model_editor.layout);
                    $scope.model_editor.three_model.animate();
                    $("#canvas_wrapper canvas").on("mousedown touchstart", function (event) {
                        $scope.model_editor.onFocus(event);
                    });
                    $("#canvas_wrapper canvas").on("mouseup mouseout touchend touchcancel touchleave", function (event) {
                        $scope.model_editor.onUnfocus();
                        $scope.$apply();
                    });
                    model_loader.scene = $scope.model_editor.three_model.scene;
                    model_loader.loadJSON();
                }
            }
        };
    };
    ModelEditorDirective.width_offset = 220 + 45;
    ModelEditorDirective.height_offset = 186 + 40;
    return ModelEditorDirective;
})();
angular.module(APP_NAME).directive("modelEditor", [
    "$rootScope",
    "$window",
    "ModelLoaderService",
    ModelEditorDirective.getDDO
]);
var ModelEditorPanelController = (function () {
    function ModelEditorPanelController($scope, $rootScope, three_model) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.disabled = false;
        this._three_model = three_model;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    ModelEditorPanelController.prototype.onClick = function (id) {
        switch (id) {
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
    };
    ModelEditorPanelController.$inject = [
        "$scope",
        "$rootScope",
        "SharedThreeService"
    ];
    return ModelEditorPanelController;
})();
var ModelEditorPanelDirective = (function () {
    function ModelEditorPanelDirective() {
    }
    ModelEditorPanelDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: ModelEditorPanelController,
            controllerAs: "model_editor_panel",
            scope: {},
            templateUrl: "./angularjs/components/ModelEditorPanel/view.html",
            replace: true
        };
    };
    return ModelEditorPanelDirective;
})();
angular.module(APP_NAME).directive("modelEditorPanel", [
    ModelEditorPanelDirective.getDDO
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
        var result = this.$window.confirm("Are you sure you want to create a new motion?\n\n" + "Working contents will have destroyed.\n" + 'If your motion has not been saved yet, please click to the "Cancel" button.');
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
var NewButtonDirective = (function () {
    function NewButtonDirective() {
    }
    NewButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: NewButtonController,
            controllerAs: "new_button",
            scope: {},
            templateUrl: "./angularjs/components/NewButton/view.html",
            replace: true
        };
    };
    return NewButtonDirective;
})();
angular.module(APP_NAME).directive("newButton", [
    NewButtonDirective.getDDO
]);
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
var NextButtonDirective = (function () {
    function NextButtonDirective() {
    }
    NextButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: NextButtonController,
            controllerAs: "next_button",
            scope: {},
            templateUrl: "./angularjs/components/NextButton/view.html",
            replace: true
        };
    };
    return NextButtonDirective;
})();
angular.module(APP_NAME).directive("nextButton", [
    NextButtonDirective.getDDO
]);
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
var OpenButtonDirective = (function () {
    function OpenButtonDirective() {
    }
    OpenButtonDirective.getDDO = function (model_loader) {
        return {
            restrict: "E",
            controller: OpenButtonController,
            controllerAs: "open_button",
            scope: {},
            templateUrl: "./angularjs/components/OpenButton/view.html",
            replace: true,
            link: function ($scope, $element) {
                $($element[0].children[1]).on("change", function (event) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        $scope.open_button.motion.loadJSON(event.target.result, model_loader.getAxisMap());
                        $scope.$apply();
                    };
                    reader.readAsText(event.target.files[0]);
                });
            }
        };
    };
    return OpenButtonDirective;
})();
angular.module(APP_NAME).directive("openButton", [
    "ModelLoaderService",
    OpenButtonDirective.getDDO
]);
var PlayPauseButtonController = (function () {
    function PlayPauseButtonController($scope, $rootScope, motion_model, plen_controll_server_service) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.motion_model = motion_model;
        this.plen_controll_server_service = plen_controll_server_service;
        this.playing = false;
        this.title = "Play a motion.";
        $scope.$on("ComponentDisabled", function () {
            _this.playing = true;
            _this.title = "Pause a motion.";
        });
        $scope.$on("ComponentEnabled", function () {
            _this.playing = false;
            _this.title = "Play a motion.";
        });
    }
    PlayPauseButtonController.prototype.onClick = function () {
        if (this.playing === false) {
            this.$rootScope.$broadcast("ComponentDisabled");
            this.$rootScope.$broadcast("FrameSave", this.motion_model.getSelectedFrameIndex());
            this.$rootScope.$broadcast("AnimationPlay");
            if (this.plen_controll_server_service.getStatus() === 1 /* CONNECTED */) {
                this.plen_controll_server_service.play(this.motion_model.slot);
            }
        }
        else {
            this.$rootScope.$broadcast("AnimationStop");
            if (this.plen_controll_server_service.getStatus() === 1 /* CONNECTED */) {
                this.plen_controll_server_service.stop();
            }
        }
    };
    PlayPauseButtonController.$inject = [
        "$scope",
        "$rootScope",
        "SharedMotionService",
        "PLENControlServerService"
    ];
    return PlayPauseButtonController;
})();
var PlayPauseButtonDirective = (function () {
    function PlayPauseButtonDirective() {
    }
    PlayPauseButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: PlayPauseButtonController,
            controllerAs: "play_pause_button",
            scope: {},
            templateUrl: "./angularjs/components/PlayPauseButton/view.html",
            replace: true
        };
    };
    return PlayPauseButtonDirective;
})();
angular.module(APP_NAME).directive("playPauseButton", [
    PlayPauseButtonDirective.getDDO
]);
var PLENControlServerModalController = (function () {
    function PLENControlServerModalController($modalInstance) {
        this.$modalInstance = $modalInstance;
        this.ip_addr = "127.0.0.1:17264";
    }
    PLENControlServerModalController.prototype.connect = function () {
        var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/;
        if (regexp.test(this.ip_addr)) {
            this.$modalInstance.close(this.ip_addr);
        }
        else {
            alert("IP address has invalid format.");
        }
    };
    PLENControlServerModalController.prototype.cancel = function () {
        this.$modalInstance.dismiss();
    };
    PLENControlServerModalController.$inject = [
        "$modalInstance"
    ];
    return PLENControlServerModalController;
})();
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
var PreviousButtonDirective = (function () {
    function PreviousButtonDirective() {
    }
    PreviousButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: PreviousButtonController,
            controllerAs: "previous_button",
            scope: {},
            templateUrl: "./angularjs/components/PreviousButton/view.html",
            replace: true
        };
    };
    return PreviousButtonDirective;
})();
angular.module(APP_NAME).directive("previousButton", [
    PreviousButtonDirective.getDDO
]);
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
var ResetButtonDirective = (function () {
    function ResetButtonDirective() {
    }
    ResetButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: ResetButtonController,
            controllerAs: "reset_button",
            scope: {},
            templateUrl: "./angularjs/components/ResetButton/view.html",
            replace: true
        };
    };
    return ResetButtonDirective;
})();
angular.module(APP_NAME).directive("resetButton", [
    ResetButtonDirective.getDDO
]);
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
var SaveButtonDirective = (function () {
    function SaveButtonDirective() {
    }
    SaveButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: SaveButtonController,
            controllerAs: "save_button",
            scope: {},
            templateUrl: "./angularjs/components/SaveButton/view.html",
            replace: true
        };
    };
    return SaveButtonDirective;
})();
angular.module(APP_NAME).directive("saveButton", [
    SaveButtonDirective.getDDO
]);
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
                        return $window.innerWidth - ScrollableContainerDirective.WIDTH_OFFSET;
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
    ScrollableContainerDirective.WIDTH_OFFSET = 220;
    return ScrollableContainerDirective;
})();
angular.module(APP_NAME).directive("scrollableContainer", [
    "$window",
    ScrollableContainerDirective.getDDO
]);
var ShoppingcartButtonDirective = (function () {
    function ShoppingcartButtonDirective() {
    }
    ShoppingcartButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "./angularjs/components/ShoppingcartButton/view.html",
            replace: true
        };
    };
    return ShoppingcartButtonDirective;
})();
angular.module(APP_NAME).directive("shoppingcartButton", [
    ShoppingcartButtonDirective.getDDO
]);
"use strict";
var SyncButtonController = (function () {
    function SyncButtonController($scope, $rootScope, plen_controll_server_service) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.plen_controll_server_service = plen_controll_server_service;
        this.disabled = false;
        this.syncing = false;
        $scope.$on("ComponentDisabled", function () {
            _this.disabled = true;
        });
        $scope.$on("ComponentEnabled", function () {
            _this.disabled = false;
        });
    }
    SyncButtonController.prototype.onClick = function () {
        var _this = this;
        var success_callback = function () {
            _this.syncing = true;
            _this.$rootScope.$broadcast("SyncBegin");
        };
        if (!this.syncing) {
            if (this.plen_controll_server_service.getStatus() === 0 /* DISCONNECTED */) {
                this.plen_controll_server_service.connect(success_callback);
            }
            if (this.plen_controll_server_service.getStatus() === 1 /* CONNECTED */) {
                success_callback();
            }
        }
        else {
            this.syncing = false;
            this.$rootScope.$broadcast("SyncEnd");
        }
    };
    SyncButtonController.$inject = [
        "$scope",
        "$rootScope",
        "PLENControlServerService"
    ];
    return SyncButtonController;
})();
var SyncButtonDirective = (function () {
    function SyncButtonDirective() {
    }
    SyncButtonDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: SyncButtonController,
            controllerAs: "sync_button",
            scope: {},
            templateUrl: "./angularjs/components/SyncButton/view.html",
            replace: true
        };
    };
    return SyncButtonDirective;
})();
angular.module(APP_NAME).directive("syncButton", [
    SyncButtonDirective.getDDO
]);
"use strict";
var TwitterButtonController = (function () {
    function TwitterButtonController($window) {
        this.$window = $window;
        this.href = "http://twitter.com/share?text=あなた好みにPLENを動かそう！「PLEN - Motion Editor for Web.」は、誰でも簡単にPLENのモーションを作成できるwebアプリです。&url=http://plen.jp/playground/motion-editor/&hashtags=PLEN";
    }
    TwitterButtonController.prototype.click = function () {
        this.$window.open(encodeURI(this.href), 'tweeter_window', 'width=650,height=470,menubar=no,toolbar=no,location=no,scrollbars=yes,sizable=yes');
    };
    TwitterButtonController.$inject = ['$window'];
    return TwitterButtonController;
})();
var TwitterButtonDirective = (function () {
    function TwitterButtonDirective() {
    }
    TwitterButtonDirective.getDDO = function () {
        return {
            restrict: 'E',
            controller: TwitterButtonController,
            controllerAs: 'twitter_button',
            scope: {},
            templateUrl: "./angularjs/components/TwitterButton/view.html",
            replace: true
        };
    };
    return TwitterButtonDirective;
})();
angular.module(APP_NAME).directive("twitterButton", [
    TwitterButtonDirective.getDDO
]);
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
angular.module(APP_NAME).directive("autoResize", [
    "$window",
    "$timeout",
    AutoResizeDirective.getDDO
]);
var SERVER_STATE;
(function (SERVER_STATE) {
    SERVER_STATE[SERVER_STATE["DISCONNECTED"] = 0] = "DISCONNECTED";
    SERVER_STATE[SERVER_STATE["CONNECTED"] = 1] = "CONNECTED";
    SERVER_STATE[SERVER_STATE["WAITING"] = 2] = "WAITING";
})(SERVER_STATE || (SERVER_STATE = {}));
;
var PLENControlServerService = (function () {
    function PLENControlServerService($http, $modal, $rootScope, motion) {
        var _this = this;
        this.$http = $http;
        this.$modal = $modal;
        this.$rootScope = $rootScope;
        this.motion = motion;
        this._state = 0 /* DISCONNECTED */;
        this._syncing = false;
        this.$rootScope.$on("SyncBegin", function () {
            _this.onSyncBegin();
        });
        this.$rootScope.$on("SyncEnd", function () {
            _this.onSyncEnd();
        });
    }
    PLENControlServerService.prototype.connect = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 0 /* DISCONNECTED */) {
            var modal = this.$modal.open({
                controller: PLENControlServerModalController,
                controllerAs: "modal",
                templateUrl: "./angularjs/components/PLENControlServerModal/view.html"
            });
            modal.result.then(function (ip_addr) {
                _this._state = 2 /* WAITING */;
                _this._ip_addr = ip_addr;
                _this.$http.get("//" + _this._ip_addr + "/connect").success(function (response) {
                    if (response.result === true) {
                        _this._state = 1 /* CONNECTED */;
                        if (!_.isNull(success_callback)) {
                            success_callback();
                        }
                    }
                    else {
                        _this._state = 0 /* DISCONNECTED */;
                    }
                }).error(function () {
                    _this._state = 0 /* DISCONNECTED */;
                });
            });
        }
    };
    PLENControlServerService.prototype.disconnect = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state === 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/disconnect").success(function (response) {
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
                _this._state = 0 /* DISCONNECTED */;
            }).error(function () {
                _this._state = 1 /* CONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.install = function (json, success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.post("//" + this._ip_addr + "/install", json).success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            }).finally(function () {
                _this.$rootScope.$broadcast("InstallFinished");
            });
        }
    };
    PLENControlServerService.prototype.play = function (slot, success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/play/" + slot.toString()).success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.stop = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state === 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/stop").success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.getStatus = function () {
        return this._state;
    };
    PLENControlServerService.prototype.onSyncBegin = function () {
        this._syncing = true;
    };
    PLENControlServerService.prototype.onSyncEnd = function () {
        this._syncing = false;
    };
    PLENControlServerService.$inject = [
        "$http",
        "$modal",
        "$rootScope",
        "SharedMotionService"
    ];
    return PLENControlServerService;
})();
angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);
//# sourceMappingURL=bundle.js.map