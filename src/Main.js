import * as CANNON from '../build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OrbitControls } from './utils/OrbitControls.js';
import * as ContentManager from './modules/ContentManager.js';
import * as WorldPhysic from './modules/WorldPhysics.js'
import * as Vehicle from './modules/Vehicle.js'
import * as ThreeHelper from './modules/ThreeHelper.js'

// three.js variables
const canvas = document.querySelector('#c');
let camera, scene, renderer;
let raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
pointer.x = 100;
pointer.y = 100;
let intersects = [];

// cannon.js variables
let world;
let engineeringFountain;
let chassisBody;
let vehicle;
let wheelBody;
let stopSigns = []
const timeStep = 1 / 60;
let lastCallTime;
const groundMaterial = new CANNON.Material('ground');
const wheelMaterial = new CANNON.Material('wheel');
const origin = new THREE.Vector2(0, 0.4)


// document.getElementById("x-button").onclick = ContentManager.removeCard;
// document.getElementById("next-slide").onclick = ContentManager.rotateCardsNext;
// document.getElementById("prev-slide").onclick = ContentManager.rotateCardsPrev;

initThree();

function initThree() {
    // Camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(99, 204, 112);


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
    chassisBody = Vehicle.initChassisBody({x: -220, y: 90, z:-50});
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
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(260, 32.5, 60), new CANNON.Vec3(20, 48.5, -63), false);

            WorldPhysic.addBellTower(world, scene, new CANNON.Vec3(267, 120, -51), true);
            
            engineeringFountain = WorldPhysic.loadEngineeringFountain(world, scene, new CANNON.Vec3(-50, 95, -30));

            // Adding stop signs, these are meant to be movable objects backed by the physics of the game.
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-170,107,-40), new CANNON.Vec3(0,Math.PI,0), 0))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-60,107,-40), new CANNON.Vec3(0,Math.PI,0), 1))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(30,107,-40), new CANNON.Vec3(0,Math.PI,0), 2))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(130,107,-40), new CANNON.Vec3(0,Math.PI,0), 3))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(220,107,-40), new CANNON.Vec3(0,Math.PI,0), 4))

            // Adding checkpoints, these are thin blocks to indicate when the vehicle should stop.
            // How does the vehicle know when to stop? Refer to calculate check point
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(-180,90,-80), ContentManager.CARDS[0], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(-70,90,-80), ContentManager.CARDS[1], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(20,90,-80), ContentManager.CARDS[2], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(120,90,-80), ContentManager.CARDS[3], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(210,90,-80), ContentManager.CARDS[4], false)

        }

    }
}


function animate() {
    requestAnimationFrame(animate);

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

    let stopSign0 = scene.getObjectByName("stopSign0");
    let stopSign1 = scene.getObjectByName("stopSign1");
    let stopSign2 = scene.getObjectByName("stopSign2");
    let stopSign3 = scene.getObjectByName("stopSign3");
    let stopSign4 = scene.getObjectByName("stopSign4");
    try {
        stopSign0.position.copy(stopSigns[0].position);
        stopSign0.quaternion.copy(stopSigns[0].quaternion);
        
        stopSign1.position.copy(stopSigns[1].position);
        stopSign1.quaternion.copy(stopSigns[1].quaternion);

        stopSign2.position.copy(stopSigns[2].position);
        stopSign2.quaternion.copy(stopSigns[2].quaternion);
        
        stopSign3.position.copy(stopSigns[3].position);
        stopSign3.quaternion.copy(stopSigns[3].quaternion);

        stopSign4.position.copy(stopSigns[4].position);
        stopSign4.quaternion.copy(stopSigns[4].quaternion);
    } catch (e) {
        console.log("error with the stop sign");
    }

    let train = scene.getObjectByName("train", true)

    try {
        train.position.copy(chassisBody.position);
        train.quaternion.copy(chassisBody.quaternion);
        train.rotateY(Math.PI)
        train.position.y -= 0.5
    
        if (train.position.y < -100) {
            chassisBody.position.set(-200, 90, -50)
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
            chassisBody.angularVelocity.set(0, 0, 0)
            chassisBody.velocity.set(0, 0, 0)
        }
    } catch (e) {
        console.log("error in updating chasis body");
    }
    const isChaseCam = true
    if (isChaseCam) {
        camera.position.x = chassisBody.position.x;
        camera.position.y = chassisBody.position.y + 40;
        camera.position.z = chassisBody.position.z + 60;
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
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        const toggle = document.getElementById("chaseCamToggle");
        toggle.style.display = "none";
    } else {
        calculateCheckPoint();
        // document.getElementById("start-slide").style.display = "none";
    }
    renderer.render(scene, camera)
}

/*
 Hover effect calculates the pointer's position and determine if it is pointing
 at a building. If true, then it will show the information card related to the building
*/
function hoverEffect() {
    raycaster.setFromCamera(pointer, camera)

    const objects = raycaster.intersectObjects(scene.children);

    if (objects.length != 0 && !pyramidExist) {

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

/**
 * This function will calculate if the center of the screen is intersecting with one of the checkpoints
 * or not. If so, then will immediately stop the vehicle and show information card.
 */
function calculateCheckPoint() {
    
    raycaster.setFromCamera(origin, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length != 0) {

        chassisBody.velocity.set(0,0,0)        
        // call the cards out because the vehicle is in checkpoint
        ContentManager.updateContent(document, intersects[0].object.content)
        ContentManager.addCard()

    }
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', onPointerMove, true)
document.addEventListener('keydown', (event) => {  
    if (event.repeat) {
        return
    }
    Vehicle.vehicleControlKeyDown(event, vehicle, chassisBody);
});


// Reset force on keyup
document.addEventListener('keyup', (event) => {
    // Vehicle.vehicleControlKeyUp(event, vehicle, chassisBody);
    if (event.key == 'Escape') {
        ContentManager.removeCard();
    }
});