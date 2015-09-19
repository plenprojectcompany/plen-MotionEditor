/**
 * @author arodic / https://github.com/arodic
 */
 /*jshint sub:true*/

(function () {

	'use strict';

	var GizmoMaterial = function ( parameters ) {

		THREE.MeshLambertMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.side = THREE.FrontSide;
		this.transparent = true;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );

			} else {

				this.color.copy( this.oldColor );
				this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );
	GizmoMaterial.prototype.constructor = GizmoMaterial;

	THREE.TransformGizmo = function () {

		var scope = this;
		var showPickers = false; //debug
		var showActivePlane = false; //debug

		this.init = function () {

			THREE.Object3D.call( this );

			this.handles = new THREE.Object3D();
			this.pickers = new THREE.Object3D();
			this.planes = new THREE.Object3D();

			this.add(this.handles);
			this.add(this.pickers);
			this.add(this.planes);

			//// PLANES

			var planeGeometry = new THREE.PlaneBufferGeometry( 50, 50, 2, 2 );
			var planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
			planeMaterial.side = THREE.DoubleSide;

			var planes = {
				"XY":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"YZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XYZE": new THREE.Mesh( planeGeometry, planeMaterial )
			};

			this.activePlane = planes["XYZE"];

			planes["YZ"].rotation.set( 0, Math.PI / 2, 0 );
			planes["XZ"].rotation.set( -Math.PI / 2, 0, 0 );

			for (var i in planes) {
				planes[i].name = i;
				this.planes.add(planes[i]);
				this.planes[i] = planes[i];
				planes[i].visible = false;
			}

			//// HANDLES AND PICKERS

			var setupGizmos = function( gizmoMap, parent ) {

				for ( var name in gizmoMap ) {

					for ( i = gizmoMap[name].length; i --;) {

						var object = gizmoMap[name][i][0];
						var position = gizmoMap[name][i][1];
						var rotation = gizmoMap[name][i][2];

						object.name = name;

						if ( position ) object.position.set( position[0], position[1], position[2] );
						if ( rotation ) object.rotation.set( rotation[0], rotation[1], rotation[2] );

						parent.add( object );

					}

				}

			};

			setupGizmos(this.handleGizmos, this.handles);
			setupGizmos(this.pickerGizmos, this.pickers);

			// reset Transformations

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

		this.hide = function () {
			this.traverse(function( child ) {
				child.visible = false;
			});
		};

		this.show = function () {
			this.traverse(function( child ) {
				child.visible = true;
				if (child.parent == scope.pickers ) child.visible = showPickers;
				if (child.parent == scope.planes ) child.visible = false;
			});
			this.activePlane.visible = showActivePlane;
		};

		this.highlight = function ( axis ) {
			this.traverse(function( child ) {
				if ( child.material && child.material.highlight ) {
					if ( child.name == axis ) {
						child.material.highlight( true );
					} else {
						child.material.highlight( false );
					}
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
			if ( child.name.search("E") != -1 ) {
				child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );
			} else if ( child.name.search("X") != -1 || child.name.search("Y") != -1 || child.name.search("Z") != -1 ) {
				child.quaternion.setFromEuler( rotation );
			}
		});

	};

	THREE.TransformGizmoRotate = function () {

		THREE.TransformGizmo.call( this );

		this.handleGizmos = {
			// X: [
			// 	[ new THREE.Line( new CircleGeometry(1,'x',0.5), new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			// ],
			Y: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1.5, 0.25, 8, 16, 2 * Math.PI ), new GizmoMaterial( { color: 0x00ff00, opacity: 0.5 } ) ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ] ]
				// [ new THREE.Line( new CircleGeometry(1,'y',0.5), new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],
			// Z: [
			// 	[ new THREE.Line( new CircleGeometry(1,'z',0.5), new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			// ],
		};

		this.pickerGizmos = {
			// X: [
			// 	[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), new GizmoMaterial( { color: 0xff0000, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, -Math.PI / 2, -Math.PI / 2 ] ]
			// ],
			Y: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1.5, 0.5, 4, 12, 2 * Math.PI ), new GizmoMaterial( { color: 0x00ff00, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ] ]
			],
			// Z: [
			// 	[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), new GizmoMaterial( { color: 0x0000ff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, -Math.PI / 2 ] ]
			// ],
		};

		this.setActivePlane = function ( axis ) {

			if ( axis == "E" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis == "X" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis == "Y" ) this.activePlane = this.planes[ "XZ" ];

			if ( axis == "Z" ) this.activePlane = this.planes[ "XY" ];

			// this.hide();
			// this.show();

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

		// TODO: Make non-uniform scale and rotate play nice in hierarchies
		// TODO: ADD RXYZ contol

		THREE.Object3D.call( this );

		domElement = ( domElement !== undefined ) ? domElement : document;

		this.gizmo = {};
		this.gizmo["rotate"] = new THREE.TransformGizmoRotate();

		this.add(this.gizmo["rotate"]);

		this.gizmo["rotate"].hide();

		this.object = undefined;
		// this.snap = null;
		this.space = "world";
		this.size = 1;
		this.axis = null;

		var scope = this;

		var _dragging = false;
		var _mode = "translate";

		var changeEvent = { type: "change" };
		var mouseDownEvent = { type: "mouseDown" };
		var mouseUpEvent = { type: "mouseUp", mode: _mode };
		var objectChangeEvent = { type: "objectChange" };

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

		var parentRotationMatrix  = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix  = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		// domElement.addEventListener( "mousedown", onPointerDown, false );
		// domElement.addEventListener( "touchstart", onPointerDown, false );

		// domElement.addEventListener( "mousemove", onPointerHover, false );
		// domElement.addEventListener( "touchmove", onPointerHover, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onPointerUp, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		this.attach = function ( object ) {

			scope.object = object;

			// this.gizmo["rotate"].hide();
			// this.gizmo[_mode].show();

			scope.update();

		};

		this.detach = function ( object ) {

			scope.object = undefined;
			this.axis = null;

			// this.gizmo["rotate"].hide();

		};

		this.setMode = function ( mode ) {

			_mode = mode ? mode : _mode;

			if ( _mode == "scale" ) scope.space = "local";

			// this.gizmo["rotate"].hide();
			// this.gizmo[_mode].show();

			this.update();
			scope.dispatchEvent( changeEvent );

		};

		//this.setSnap = function ( snap ) {

		//	scope.snap = snap;

		//};

		this.setSize = function ( size ) {

			scope.size = size;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setSpace = function ( space ) {

			scope.space = space;
			this.update();
			scope.dispatchEvent( changeEvent );

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

			if ( scope.space == "local" )
				this.gizmo[_mode].update( worldRotation, eye );

			//else if ( scope.space == "world" )
			//	this.gizmo[_mode].update( new THREE.Euler(), eye );

			//this.gizmo[_mode].highlight( scope.axis );

		};

		//function onPointerHover(event) {
		//	if ( scope.object === undefined || _dragging === true ) return;

		//	event.preventDefault();

		//	var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

		//	var intersect = intersectObjects( pointer, scope.gizmo[_mode].pickers.children );

		//	var axis = null;

		//	if ( intersect ) {

		//		axis = intersect.object.name;

		//	}

		//	if ( scope.axis !== axis ) {

		//		scope.axis = axis;
		//		scope.update();
		//		scope.dispatchEvent( changeEvent );

		//	}

		//}

		function onPointerDown(event) {
			if ( scope.object === undefined || _dragging === true ) return;

			event.preventDefault();
			event.stopPropagation();

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {

				// var intersect = intersectObjects( pointer, scope.gizmo[_mode].pickers.children );

				// if ( intersect ) {
					// scope.dispatchEvent( mouseDownEvent );

					scope.axis = "Y"; // intersect.object.name;

					scope.update();

					eye.copy( camPosition ).sub( worldPosition ).normalize();

					scope.gizmo[_mode].setActivePlane( scope.axis, eye );

					var planeIntersect = intersectObjects( pointer, [ scope.gizmo[_mode].activePlane ] );

					oldPosition.copy(scope.object.position);;
					oldScale.copy( scope.object.scale );

					oldRotationMatrix.extractRotation( scope.object.matrix );
					worldRotationMatrix.extractRotation( scope.object.matrixWorld );

					parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
					parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

					offset.copy(planeIntersect.point);
				// }

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

			if ( _mode == "rotate" ) {

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

					scope.object.quaternion.copy( quaternionXYZ );

				}

			}

			scope.update();
			scope.dispatchEvent( changeEvent );
			scope.dispatchEvent( objectChangeEvent );

		}

		function onPointerUp(event) {
			if ( _dragging && ( scope.axis !== null ) ) {
				mouseUpEvent.mode = _mode;
				scope.dispatchEvent(mouseUpEvent);
			}
		    _dragging = false;
		    // scope.detach();

			// onPointerHover( event );
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
