import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import {OrbitControls} from './OrbitControls.js';
import {OBJLoader} from './OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js'
import {DragControls} from './DragControls.js'


function main() {

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 2000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(250, 350, 200);

const orbitControls = new OrbitControls(camera, canvas);
// orbitControls.target.set(0, 5, 0);
// orbitControls.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color('#CBD9E6');

{
    const skyColor = 0xCBD9E6;  
    const groundColor = 0xE2E2E4;  
    const intensity = 0.7;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(10, 70, 50);
    scene.add(light);
    scene.add(light.target);
}

{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/PurdueMiniature/PurdueMiniature.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/PurdueMiniature/PurdueMiniature.obj', 
        // onLoad Callback
        function (world) {
            scene.add(world);
        },
        // onProgress Callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
        });
    });
}

{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/Train/11709_train_v1_L3.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/Train/11709_train_v1_L3.obj', (train) => {
            train.rotation.x = -Math.PI / 2;
            train.position.y = 80;
            train.position.x = -80;
            train.position.z = -50;
            scene.add(train);
            objects.push(train);
        });
    });
    
    // const dragControls = new DragControls ( objects, camera, canvas );
    // dragControls.addEventListener ( 'dragstart', function() {orbitControls.enabled = false; });
    // dragControls.addEventListener ( 'dragend', function() {orbitControls.enabled = true; }); 
}

{

}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
    renderer.setSize(width, height, false);
    }
    return needResize;
}

function render() {

    if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
}

main();
