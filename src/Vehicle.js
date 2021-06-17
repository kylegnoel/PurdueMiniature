import * as CANNON from '../build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OBJLoader } from '../utils/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

export function initChassisBody() {
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 1))
    const chassisBody = new CANNON.Body({
        mass: 700,
    });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(-80, 90, -50);
    chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
    chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.velocity.set(0, 0, 0);
    return chassisBody;
}

export function initVehicle(world, scene, chassisBody, wheelBody, wheelMaterial) {

    const vehicle = new CANNON.RaycastVehicle({
        chassisBody,
    })

    const wheelOptions = {
        radius: 1.5,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 30,
        suspensionRestLength: 0.1,
        frictionSlip: 3,
        dampingRelaxation: 2.3,
        dampingCompression: 6,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(0, 0, 2),
        chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: 3000000,
        useCustomSlidingRotationalSpeed: true,
    }

    wheelOptions.chassisConnectionPointLocal.set(-2.5, 0, 2)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(-2.5, 0, -2)
    vehicle.addWheel(wheelOptions)

    wheelOptions.radius = 1.7
    wheelOptions.chassisConnectionPointLocal.set(2.5, 0, 2)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(2.5, 0, -2)
    vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(world)

    const wheelBodies = []
    const wheelVisuals = [];
    vehicle.wheelInfos.forEach((wheel) => {
        const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 10)
        wheelBody = new CANNON.Body({
            mass: 0,
            material: wheelMaterial,
        })
        wheelBody.type = CANNON.Body.KINEMATIC
        wheelBody.collisionFilterGroup = 0 // turn off collisions
        const quaternion = new CANNON.Quaternion().setFromEuler(0, -Math.PI / 2, 0)
        // quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - Math.PI / 2)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
        wheelBodies.push(wheelBody)
        world.addBody(wheelBody)

        let wheelGeo = new THREE.CylinderGeometry(wheel.radius, wheel.radius, 1, 10)
        wheelGeo.rotateX(Math.PI / 2)
        let wheelMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            emissive: 0xaa0000,
            side: THREE.DoubleSide,
            flatShading: true,
        })
        let wheelvisual = new THREE.Mesh(wheelGeo, wheelMat)
        wheelvisual.name = "vehicle"
        wheelVisuals.push(wheelvisual)
        console.log(wheelvisual.rotation)
        scene.add(wheelvisual)
        console.log(vehicle)
    })

    world.addEventListener('postStep', () => {
        for (let i = 0; i < vehicle.wheelInfos.length; i++) {
            vehicle.updateWheelTransform(i)
            const transform = vehicle.wheelInfos[i].worldTransform
            const wheelBody = wheelBodies[i]
            const wheelVisual = wheelVisuals[i]
            wheelBody.position.copy(transform.position)
            wheelBody.quaternion.copy(transform.quaternion)
            wheelVisual.position.copy(transform.position)
            wheelVisual.quaternion.copy(transform.quaternion)
        }
    })
    return vehicle;

}

export function vehicleControlKeyDown(event, vehicle, chassisBody) {
    const maxSteerVal = 0.7;
    const maxForce = 6000;
    const brakeForce = 10000;

    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            vehicle.applyEngineForce(-maxForce, 0);
            vehicle.applyEngineForce(-maxForce, 1);
            vehicle.applyEngineForce(-maxForce, 2);
            vehicle.applyEngineForce(-maxForce, 3);
            break;

        case 's':
        case 'S':
        case 'ArrowDown':
            vehicle.applyEngineForce(maxForce, 2);
            vehicle.applyEngineForce(maxForce, 3);
            break;

        case 'a':
        case 'A':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 1);
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 1);
            break;

        case ' ':
            chassisBody.angularVelocity.set(0, 0, 0);
            chassisBody.velocity.set(0, 0, 0);
            break;

        case 'q':
            chassisBody.velocity.y = 100;
            break;

        case 'r':
        case 'R':
            chassisBody.position.set(-80, 90, -50);
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
            chassisBody.angularVelocity.set(0, 0, 0);
            chassisBody.velocity.set(0, 0, 0);
            break;
    }
}

export function vehicleControlKeyUp(event, vehicle, chassisBody) {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            vehicle.applyEngineForce(0, 0);
            vehicle.applyEngineForce(0, 1);
            vehicle.applyEngineForce(0, 2);
            vehicle.applyEngineForce(0, 3);
            break;

        case 's':
        case 'S':
        case 'ArrowDown':
            vehicle.applyEngineForce(0, 2);
            vehicle.applyEngineForce(0, 3);
            break;

        case 'a':
        case 'A':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'q':
            chassisBody.velocity.y = -5;
            break;

    }
}