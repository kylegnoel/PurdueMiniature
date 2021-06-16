import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OBJLoader } from '../utils/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from '../utils/OrbitControls.js';

function initThree( canvas, camera, scene, renderer) {
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

    // Light
    {
        const skyColor = 0xCBD9E6;
        const groundColor = 0xE2E2E4;
        const intensity = 0.85;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        light.position.set(100, 0, 0)
        scene.add(light);
    }

    // Light
    {
        const color = 0xFFFFFF;
        const intensity = 0.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(10, 70, 50);
        scene.add(light);
        scene.add(light.target);
    }
    // Load purdue miniature 3d model
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
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                });
        });
    }


    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement);


    window.addEventListener('resize', onWindowResize)

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })


    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/BoilermakerXtraSpecial/BoilermakerXtraSpecial.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/BoilermakerXtraSpecial/BoilermakerXtraSpecial.obj', (train) => {
            scene.add(train)
            train.name = "train"
            console.log(train.name)
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("LOADED")
            }
        });
    });


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

export { initThree, onWindowResize }