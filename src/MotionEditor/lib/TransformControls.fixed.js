/**
 * @author arodic / https://github.com/arodic
 * @author Kazuyuki TAKASE / https://github.com/Guvalif
 */

(function () {
	'use strict';

	THREE.TransformGizmo = function () {
	    var scope = this;

		this.init = function () {
			THREE.Object3D.call( this );

			this.planes = new THREE.Object3D();
			this.add(this.planes);

			//// PLANES
			var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );
			var planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
			planeMaterial.side = THREE.DoubleSide;

			var planes = {
				"XY": new THREE.Mesh( planeGeometry, planeMaterial ),
				"YZ": new THREE.Mesh( planeGeometry, planeMaterial ),
				"ZX": new THREE.Mesh( planeGeometry, planeMaterial )
			};

			this.activePlane = planes["XY"];
			planes["YZ"].rotation.set( 0, Math.PI / 2, 0 );
			planes["ZX"].rotation.set( -Math.PI / 2, 0, 0 );

			for (var i in planes) {
				planes[i].name = i;
				this.planes.add(planes[i]);
				this.planes[i] = planes[i];
				planes[i].visible = false;
			}

			this.traverse(function ( child ) {
				if (child instanceof THREE.Mesh) {
					child.updateMatrix();

					var tempGeometry = child.geometry.clone();
					tempGeometry.applyMatrix( child.matrix );
					child.geometry = tempGeometry;

					child.position.set( 0, 0, 0 );
					child.rotation.set( 0, 0, 0 );
					child.scale.set( 1, 1, 1 );
				}
			});
		};
	};

	THREE.TransformGizmo.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformGizmo.prototype.constructor = THREE.TransformGizmo;

	THREE.TransformGizmo.prototype.update = function ( rotation, eye ) {
		var vec1 = new THREE.Vector3( 0, 0, 0 );
		var vec2 = new THREE.Vector3( 0, 1, 0 );
		var lookAtMatrix = new THREE.Matrix4();

		this.traverse(function(child) {
			if ( child.name.search("X") != -1 || child.name.search("Y") != -1 || child.name.search("Z") != -1 ) {
				child.quaternion.setFromEuler( rotation );
			}
		});
	};

	THREE.TransformGizmoRotate = function () {
		THREE.TransformGizmo.call( this );

		this.setActivePlane = function ( axis ) {
			if ( axis == "X" ) this.activePlane = this.planes[ "YZ" ];
			if ( axis == "Y" ) this.activePlane = this.planes[ "ZX" ];
			if ( axis == "Z" ) this.activePlane = this.planes[ "XY" ];
		};

		this.update = function ( rotation, eye2 ) {
			THREE.TransformGizmo.prototype.update.apply( this, arguments );

			var tempMatrix = new THREE.Matrix4();
			var worldRotation = new THREE.Euler( 0, 0, 1 );
			var tempQuaternion = new THREE.Quaternion();
			var unitX = new THREE.Vector3( 1, 0, 0 );
			var unitY = new THREE.Vector3( 0, 1, 0 );
			var unitZ = new THREE.Vector3( 0, 0, 1 );
			var quaternionX = new THREE.Quaternion();
			var quaternionY = new THREE.Quaternion();
			var quaternionZ = new THREE.Quaternion();
			var eye = eye2.clone();

			worldRotation.copy( this.planes["XY"].rotation );
			tempQuaternion.setFromEuler( worldRotation );

			tempMatrix.makeRotationFromQuaternion( tempQuaternion ).getInverse( tempMatrix );
			eye.applyMatrix4( tempMatrix );

			this.traverse(function(child) {
				tempQuaternion.setFromEuler( worldRotation );

				if ( child.name == "X" ) {
					quaternionX.setFromAxisAngle( unitX, Math.atan2( -eye.y, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					child.quaternion.copy( tempQuaternion );
				}

				if ( child.name == "Y" ) {
					quaternionY.setFromAxisAngle( unitY, Math.atan2( eye.x, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					child.quaternion.copy( tempQuaternion );
				}

				if ( child.name == "Z" ) {
					quaternionZ.setFromAxisAngle( unitZ, Math.atan2( eye.y, eye.x ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );
					child.quaternion.copy( tempQuaternion );
				}
			});
		};

		this.init();
	};

	THREE.TransformGizmoRotate.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoRotate.prototype.constructor = THREE.TransformGizmoRotate;

	THREE.TransformControls = function ( camera, domElement ) {
		THREE.Object3D.call( this );

		domElement = ( domElement !== undefined ) ? domElement : document;

		this.gizmo = {
		    "rotate": new THREE.TransformGizmoRotate()
		};
		this.add(this.gizmo["rotate"]);

		this.object = undefined;
		this.space = "local";
		this.size = 1;
		this.axis = null;

		var scope = this;

		var _dragging = false;
		var _mode = "rotate";

		var angle_change_event = document.createEvent("Event")
		angle_change_event.initEvent("angleChange", true, true);

		var ray = new THREE.Raycaster();
		var pointerVector = new THREE.Vector3();

		var point = new THREE.Vector3();
		var offset = new THREE.Vector3();

		var rotation = new THREE.Vector3();
		var offsetRotation = new THREE.Vector3();
		var scale = 1;

		var lookAtMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();

		var tempMatrix = new THREE.Matrix4();
		var tempVector = new THREE.Vector3();
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );

		var quaternionXYZ = new THREE.Quaternion();
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var quaternionE = new THREE.Quaternion();

		var oldPosition = new THREE.Vector3();
		var oldScale = new THREE.Vector3();
		var oldRotationMatrix = new THREE.Matrix4();

		var parentRotationMatrix = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix  = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		// domElement.addEventListener( "mousedown", onPointerDown, false );
		// domElement.addEventListener( "touchstart", onPointerDown, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onPointerUp, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		this.attach = function ( object ) {
			scope.object = object;
			scope.update();
		};

		this.detach = function ( object ) {
			scope.object = undefined;
			this.axis = null;
		};

		this.setMode = function ( mode ) {
			_mode = mode ? mode : _mode;

			if ( _mode == "scale" ) scope.space = "local";

			this.update();
		};

		this.setSpace = function ( space ) {
			scope.space = space;
			this.update();
		};

		this.update = function () {
			if ( scope.object === undefined ) return;

			scope.object.updateMatrixWorld();
			worldPosition.setFromMatrixPosition( scope.object.matrixWorld );
			worldRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

			camera.updateMatrixWorld();
			camPosition.setFromMatrixPosition( camera.matrixWorld );
			camRotation.setFromRotationMatrix( tempMatrix.extractRotation( camera.matrixWorld ) );

			scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;
			this.position.copy( worldPosition );
			this.scale.set( scale, scale, scale );

			eye.copy( camPosition ).sub( worldPosition ).normalize();

			this.gizmo[_mode].update( worldRotation, eye );
		};

		function onPointerDown(event) {
			if ( scope.object === undefined || _dragging === true ) return;

			event.preventDefault();
			event.stopPropagation();

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {
			    scope.axis = "Y";

				scope.update();

				eye.copy( camPosition ).sub( worldPosition ).normalize();

				scope.gizmo[_mode].setActivePlane( scope.axis, eye );

				var planeIntersect = intersectObjects(pointer, [scope.gizmo[_mode].activePlane]);
				if (planeIntersect === false) return;

				oldPosition.copy(scope.object.position);;
				oldScale.copy( scope.object.scale );

				oldRotationMatrix.extractRotation( scope.object.matrix );
				worldRotationMatrix.extractRotation( scope.object.matrixWorld );

				parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
				parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

				offset.copy(planeIntersect.point);
			}

			_dragging = true;
		}

		this.$onPointerDown = function (event) {
		    onPointerDown(event);
		};

		function onPointerMove(event) {
			if ( scope.object === undefined || scope.axis === null || _dragging === false ) return;

			event.preventDefault();
			event.stopPropagation();

			var pointer = event.changedTouches ? event.changedTouches[0] : event;

			var planeIntersect = intersectObjects( pointer, [ scope.gizmo[_mode].activePlane ] );

			point.copy( planeIntersect.point );

			point.sub(worldPosition);
			point.multiply(parentScale);
			tempVector.copy(offset).sub(worldPosition);
			tempVector.multiply(parentScale);

            if ( scope.space == "local" ) {
				point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

				tempVector.applyMatrix4(tempMatrix);

				rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
				offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

				quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );
				quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
                quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
				quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

				if (scope.axis == "X") {
					quaternionXYZ.multiply(quaternionX);
				}
				if (scope.axis == "Y") {
					quaternionXYZ.multiply(quaternionY);
				}
				if (scope.axis == "Z") {
					quaternionXYZ.multiply(quaternionZ);
				}

				scope.object.quaternion.copy(quaternionXYZ);

				document.body.dispatchEvent(angle_change_event);
			}

            scope.update();
		}

		function onPointerUp(event) {
		    _dragging = false;
		    scope.detach();
		}

		function intersectObjects( pointer, objects ) {
			var rect = domElement.getBoundingClientRect();
			var x = ( pointer.clientX - rect.left ) / rect.width;
			var y = ( pointer.clientY - rect.top ) / rect.height;

			pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1, 0.5 );
			pointerVector.unproject( camera );

			ray.set( camPosition, pointerVector.sub( camPosition ).normalize() );

			var intersections = ray.intersectObjects( objects, true );
			return intersections[0] ? intersections[0] : false;
		}
	};

	THREE.TransformControls.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformControls.prototype.constructor = THREE.TransformControls;
}());
