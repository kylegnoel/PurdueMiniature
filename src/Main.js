import * as CANNON from '../build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OrbitControls } from '../utils/OrbitControls.js';
import * as ContentManager from './ContentManager.js';
import * as WorldPhysic from './WorldPhysics.js'
import * as Vehicle from './Vehicle.js'
import * as ThreeHelper from './ThreeHelper.js'

// three.js variables
const canvas = document.querySelector('#c');
let camera, scene, renderer;
let raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let intersects = [];

// cannon.js variables
let world;
let engineeringFountain;
let chassisBody;
let vehicle;
let wheelBody;
const timeStep = 1 / 60;
let lastCallTime;
const groundMaterial = new CANNON.Material('ground');
const wheelMaterial = new CANNON.Material('wheel');

initThree();

function initThree() {
    // Camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(20, 224, 52)


    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#CBD9E6');

    ThreeHelper.initHemisphereLight(scene);

    ThreeHelper.initDirectionalLight(scene);

    ThreeHelper.load3dMap(scene);


    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize)

    ThreeHelper.loadBoilermakerXtraSpecial(scene);

    initCannon();
    animate();


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}



function initCannon() {
    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -15, 0),
    })
    world.defaultContactMaterial.friction = 0.3
    world.broadphase = new CANNON.NaiveBroadphase();
    world.iterations = 10;



    // Create the physics of the Car
    chassisBody = Vehicle.initChassisBody();
    vehicle = Vehicle.initVehicle(world, scene, chassisBody, wheelBody, wheelMaterial);

    // Adding physics of the world
    {
        // Adding the physics of the interaction/behavior between the wheel material and the ground material
        {
            const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 1000,
            })
            world.addContactMaterial(wheel_ground)

            const groundGround = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
                friction: 0.8,
                restitution: 30,
                contactEquationStiffness: 1000,
            })

            world.addContactMaterial(groundGround)
        }

        // Adding the physics of all objects on block0 (block0 is defined to be the block with the gateway to the future arch)
        {
            // Adding physics of block0
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(33, 32.5, 31), new CANNON.Vec3(-62, 48.5, -63), false);

            // Adding Physics of ramp0
            WorldPhysic.addRampPhysics(world, scene, new CANNON.Vec3(13, 32.5, 10), new CANNON.Vec3(-30, 46, -50), new CANNON.Vec3(0, 0, 1), -Math.PI / 7.8, false);

            // pillar besides the lawn
            WorldPhysic.addGatewayPillarPhysics(world, scene, new CANNON.Vec3(6, 6, 20), new CANNON.Vec3(Math.PI / 2, 0, 0), new CANNON.Vec3(-90, 100, -63), false);

            // pillar at the corner, near the edge of the block
            WorldPhysic.addGatewayPillarPhysics(world, scene, new CANNON.Vec3(6, 6, 20), new CANNON.Vec3(Math.PI / 2, 0, 0), new CANNON.Vec3(-90, 100, -37), false);

            // big tree
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-92, 83, -90), false);
            // small tree infront of the big tree
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-90, 83, -80), false);
            // small tree besides the big academic building
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-67, 83, -88), false);

            // the only academic building in block0
            WorldPhysic.addBigAcademicBuildingPhysics(world, scene, new CANNON.Vec3(-45, 93, -85), new CANNON.Quaternion(Math.PI / 2, 0, 0), false, ContentManager.CARDS[0]);
        }


        // Adding the physics of all objects in block1 (block1 is defined to be the one where engineering fountain is spwaned)
        {
            // Adding physics of block1
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(43, 32.5, 35), new CANNON.Vec3(33, 38.5, -65), false);
            // Adding physics of ramp1
            WorldPhysic.addRampPhysics(world, scene, new CANNON.Vec3(13, 32.5, 10.2), new CANNON.Vec3(63, 37.05, -33), new CANNON.Vec3(1, 0, 0), Math.PI / 8, false);

            // Adding engineering fountain
            engineeringFountain = WorldPhysic.loadEngineeringFountain(world, scene, new CANNON.Vec3(55, 77, -65));

            // small academic building on the left of the big academic building
            WorldPhysic.addSmallAcademicBuildingPhysics(world, scene, new CANNON.Vec3(1, 84, -93), new CANNON.Quaternion(Math.PI / 2, 0, 0), false)
            // bigger building in the middle
            WorldPhysic.addBigAcademicBuildingPhysics(world, scene, new CANNON.Vec3(32, 84, -93), new CANNON.Quaternion(Math.PI/2, 0, 0), false, ContentManager.CARDS[1])
            // small academic building on the right of the big academic building
            WorldPhysic.addSmallAcademicBuildingPhysics(world, scene, new CANNON.Vec3(62, 84, -93), new CANNON.Quaternion(Math.PI / 2, 0, 0), false)
        }

        // Adding the physics of all objects in block2 (block2 is defined to be the block with the big memorial lawn)
        {
            // Adding physics of block2
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(50, 50, 58), new CANNON.Vec3(73, 13, 42), false);

            // small academic building closest to the ramp connecting block2 and block3
            WorldPhysic.addSmallAcademicBuildingPhysics(world, scene, new CANNON.Vec3(30, 75, 31), new CANNON.Vec3(Math.PI/2, 0, -Math.PI/2), false);
            // small academic building closest to the ramp connecting block1 and block2
            WorldPhysic.addSmallAcademicBuildingPhysics(world, scene, new CANNON.Vec3(111, 75, -7), new CANNON.Vec3(Math.PI/2, 0, 0), false);
            // big academic building at the corner of block2 with 2 patches of grass in front
            WorldPhysic.addBigAcademicBuildingPhysics(world, scene, new CANNON.Vec3(30, 75, 83), new CANNON.Quaternion(Math.PI / 2, 0, -Math.PI/2), false, ContentManager.CARDS[1])
            
            // Tree at the middle on the smaller lawn
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(86, 67, 4), false)
            // Tree at the corener of block2
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(118, 67, 97), false)
        }

        // Adding the physics of all objects in block3 (block3 is defined to be the block with Loeb Fountain)
        {
            // Adding physics of block3
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(40, 50, 40), new CANNON.Vec3(-30, 22, 81), false);
            // Adding physics of ramp connecting block3 and block2
            WorldPhysic.addRampPhysics(world, scene, new CANNON.Vec3(13, 32.5, 10), new CANNON.Vec3(9, 37, 53), new CANNON.Vec3(0, 0, 1), -Math.PI / 7.8, false);
            // Adding small academic building
            WorldPhysic.addSmallAcademicBuildingPhysics(world, scene, new CANNON.Vec3(-55, 85, 73), new CANNON.Vec3(Math.PI/2, 0, -Math.PI/2), false);
            // Adding big academic building
            WorldPhysic.addBigAcademicBuildingPhysics(world, scene, new CANNON.Vec3(-55, 85, 103), new CANNON.Vec3(Math.PI/2, 0, -Math.PI/2), false);

        }

        // Adding physics for the bell tower block
        {
            // the block supporting the bell tower
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(10, 100, 10), new CANNON.Vec3(-50, -20, 0), false);

            // the bell tower itself
            WorldPhysic.addBellTower(world, scene, new CANNON.Vec3(-50, 120, 0), false);
        }






    }

}


function animate() {
    requestAnimationFrame(animate)

    // Step the physics world
    updatePhysics();
    let fountain = scene.getObjectByName("engineeringFountain", true);
    try {
        fountain.position.copy(engineeringFountain.position);
        fountain.quaternion.copy(engineeringFountain.quaternion);
        fountain.position.y -= 5;
    } catch (e) {
        console.error("engineering fountain not loaded yet.");
    }


    let train = scene.getObjectByName("train", true)

    try {
        train.position.copy(chassisBody.position);
        train.quaternion.copy(chassisBody.quaternion);
        train.rotateY(Math.PI)
        train.position.y -= 0.5
    
        if (train.position.y < -100) {
            chassisBody.position.set(-80, 90, -50)
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
            chassisBody.angularVelocity.set(0, 0, 0)
            chassisBody.velocity.set(0, 0, 0)
        }
    } catch (e) {
        console.error("train is not loaded yet.");
    }

    const isChaseCam = document.getElementById("chaseCamToggle");
    isChaseCam.addEventListener("keyup", (e) => { e.preventDefault(); });
    if (isChaseCam.checked) {
        camera.position.z = chassisBody.position.z + 30;
        camera.position.x = chassisBody.position.x + 30;
        camera.position.y = chassisBody.position.y + 40;
        camera.lookAt(new THREE.Vector3(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z));

    }

    render()
}

function updatePhysics() {
    const time = performance.now() / 1000
    if (!lastCallTime) {
        world.step(timeStep)
    } else {
        const dt = time - lastCallTime
        world.step(timeStep, dt)
    }
    lastCallTime = time
}
let pyramidExist = false

function render() {
    hoverEffect();
    renderer.render(scene, camera)
}

function hoverEffect() {
    raycaster.setFromCamera(pointer, camera)

    const objects = raycaster.intersectObjects(scene.children);

    if (objects.length != 0 && !pyramidExist) {
        // console.log(objects)
        intersects = objects;
        let obj = intersects[0].object;
        if (obj.name === "vehicle") {
            renderer.render(scene, camera);
            return
        }

        const pyramidGeo = new THREE.CylinderGeometry(0, 3, 9, 4);
        const pyramidMat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 1, color: 0xD2927D })
        const pyramidMesh = new THREE.Mesh(pyramidGeo, pyramidMat)
        pyramidMesh.rotateX(Math.PI)
        pyramidMesh.position.copy(new THREE.Vector3(obj.position.x, obj.position.y + 30, obj.position.z))
        pyramidExist = true
        pyramidMesh.name = "pyramid"
        scene.add(pyramidMesh)
        ContentManager.updateContent(document, obj.content);
        ContentManager.addCard();


    } else if (objects.length == 0) {
        if (intersects.length != 0) {
            let removePyramid = scene.getObjectByName("pyramid")
            scene.remove(removePyramid)
            pyramidExist = false;
        }
    } else if (objects.length != 0 && pyramidExist) {
        let pyramid = scene.getObjectByName("pyramid")
        pyramid.rotation.y += 0.05
    }

}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', onPointerMove, true)
document.addEventListener('keydown', (event) => {
    Vehicle.vehicleControlKeyDown(event, vehicle, chassisBody);
});


// Reset force on keyup
document.addEventListener('keyup', (event) => {
    Vehicle.vehicleControlKeyUp(event, vehicle, chassisBody);
});