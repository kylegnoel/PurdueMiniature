import * as CANNON from '../../build/cannon-es.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { BufferGeometryUtils } from '../utils/BufferGeometryUtils.js';
import * as ContentManager from './ContentManager.js';
import { OBJLoader } from '../utils/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

const groundMaterial = new CANNON.Material('ground')

export function loadEngineeringFountain(world, scene, position) {

    const engineeringFountain = new CANNON.Body({
        mass: 50,
        shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5)),
        material: groundMaterial
    });
    engineeringFountain.position.copy(position);
    world.addBody(engineeringFountain);

    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/EngineeringFountain/EngineeringFountain.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/EngineeringFountain/EngineeringFountain.obj', (fountain) => {
            scene.add(fountain);
            fountain.name = "engineeringFountain";
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("ENGINEERING FOUNTAIN LOADED");
            }
        });
    });
    return engineeringFountain;
}

export function addGatewayPillarPhysics(world, scene, dimensions, quaternion, position, visuals) {
    const pillar = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    });
    pillar.addShape(new CANNON.Box(dimensions));
    pillar.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z);
    pillar.position.copy(position);
    world.addBody(pillar);

    if (visuals) {
        const pillarGeo = new THREE.BoxBufferGeometry(dimensions.x * 2, dimensions.y * 2, dimensions.z * 2);
        const pillarMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true });
        const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
        pillarMesh.position.copy(pillar.position);
        pillarMesh.quaternion.copy(pillar.quaternion);
        scene.add(pillarMesh);
    }

}

export function addRampPhysics(world, scene, dimensions, position, axis, rotation, visuals) {

    const ramp = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    });
    ramp.addShape(new CANNON.Box(dimensions));


    ramp.quaternion.setFromAxisAngle(axis, rotation);
    ramp.position.copy(position);
    world.addBody(ramp);

    if (visuals) {
        const rampGeo = new THREE.BoxBufferGeometry(dimensions.x * 2, dimensions.y * 2, dimensions.z * 2);
        const rampMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true });
        const rampMesh = new THREE.Mesh(rampGeo, rampMat);

        rampMesh.position.copy(ramp.position);
        rampMesh.quaternion.copy(ramp.quaternion);
        scene.add(rampMesh);
    }

}

export function addBlockPhysics(world, scene, dimensions, position, visuals) {

    const block = new CANNON.Body({
        mass: 0,
        material: groundMaterial,
    });
    block.addShape(new CANNON.Box(dimensions));
    block.position.copy(position);
    world.addBody(block);

    if (visuals) {
        const blockGeo = new THREE.BoxBufferGeometry(dimensions.x * 2, dimensions.y * 2, dimensions.z * 2);
        const blockMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true });
        const blockMesh = new THREE.Mesh(blockGeo, blockMat);
        blockMesh.position.copy(block.position);
        blockMesh.quaternion.copy(block.quaternion);
        scene.add(blockMesh);
    }

}

export function addTreePhysics(world, scene, position, visuals) {
    const tree = new CANNON.Body({
        mass: 0,
    });
    tree.addShape(new CANNON.Box(new CANNON.Vec3(2, 4, 2)));
    tree.position.set(position.x, position.y, position.z);
    world.addBody(tree);

    if (visuals) {
        const treeGeo = new THREE.BoxBufferGeometry(4, 8, 4);
        const treeMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true });
        const treeMesh = new THREE.Mesh(treeGeo, treeMat);
        treeMesh.position.copy(tree.position);
        treeMesh.quaternion.copy(tree.quaternion);
        scene.add(treeMesh);
    }
}

export function addSmallAcademicBuildingPhysics(world, scene, position, quaternion, visuals, content) {
    const building = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    });
    building.addShape(new CANNON.Box(new CANNON.Vec3(11, 6, 20)));
    building.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z);
    building.position.set(position.x, position.y, position.z);
    world.addBody(building);

    const buildingGeo = new THREE.BoxBufferGeometry(22, 12, 40);
    const buildingMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0 });
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);
    buildingMesh.position.copy(building.position);
    buildingMesh.quaternion.copy(building.quaternion);

    building.addEventListener("collide", function (e) {
        ContentManager.updateContent(document, content);
        ContentManager.addCard();
        setTimeout(function () {
            ContentManager.removeCard()
        }, 10000);
    });

    if (visuals) {
        buildingMat.opacity = 1;
    }
    if (typeof content != 'undefined') {
        buildingMesh.content = content;
    }
    scene.add(buildingMesh);

}

export function addBigAcademicBuildingPhysics(world, scene, position, quaternion, visuals, content) {

    let building =  new CANNON.Body({ mass: 0, material: groundMaterial});
    building.position.copy(position);
    building.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z);

    let shapeBack = new CANNON.Box(new CANNON.Vec3(15, 6, 12));
    let shapeFront = new CANNON.Box(new CANNON.Vec3(8, 6, 12));
    building.addShape(shapeBack, new CANNON.Vec3(0, 0, 0));
    building.addShape(shapeFront, new CANNON.Vec3(0, 12, 0));

    world.addBody(building);

    building.addEventListener("collide", function (e) {
        ContentManager.updateContent(document, content);
        ContentManager.addCard();
        setTimeout(function () {
            ContentManager.removeCard()
        }, 10000);
    });


    // Adding some visuals

    const geometryArray = [];
    const buildingMat = new THREE.MeshNormalMaterial({ color: 0xDEBB19, side: THREE.DoubleSide, wireframe: false, transparent: true, opacity: 0 });

    const buildingBackGeo = new THREE.BoxBufferGeometry(30, 12, 24);
    const buildingBackMesh = new THREE.Mesh(buildingBackGeo, buildingMat);
    buildingBackMesh.updateMatrixWorld();
    geometryArray.push(buildingBackMesh.geometry.clone().applyMatrix4(buildingBackMesh.matrixWorld));

    const buildingFrontGeo = new THREE.BoxBufferGeometry(16, 12, 24);

    const buildingFrontMesh = new THREE.Mesh(buildingFrontGeo, buildingMat);
    buildingFrontMesh.position.copy(new THREE.Vector3(buildingBackMesh.position.x, buildingBackMesh.position.y + 10, buildingBackMesh.position.z));
    buildingFrontMesh.updateMatrix();
    geometryArray.push(buildingFrontMesh.geometry.clone().applyMatrix4(buildingFrontMesh.matrix));

    if (visuals) {
        buildingMat.opacity = 0.5;
    }

    let buildingGeo = new THREE.BufferGeometry();
    buildingGeo = BufferGeometryUtils.mergeBufferGeometries(geometryArray);
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);

    buildingMesh.position.copy(building.position);
    buildingMesh.quaternion.copy(building.quaternion);

    if (typeof content != 'undefined') {
        buildingMesh.content = content;
    }
    scene.add(buildingMesh);
}

export function addBellTower(world, scene, position, visuals, content) {
    const tower = new CANNON.Body({ 
        mass: 0, 
        material: groundMaterial
    });
    tower.addShape(new CANNON.Box(new CANNON.Vec3(7, 40, 7)));
    tower.position.copy(position);

    world.addBody(tower);

    const towerGeo = new THREE.BoxBufferGeometry(14, 80, 14);
    const towerMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0 });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    
    towerMesh.position.copy(tower.position);
    tower.quaternion.copy(tower.quaternion);
    
    tower.addEventListener("collide", function (e) {
        ContentManager.updateContent(document, content);
        ContentManager.addCard();
        setTimeout(function () {
            ContentManager.removeCard()
        }, 10000);
    });

    if (visuals) {
        towerMat.opacity = 1;
    }
    if (typeof content != 'undefined') {
        towerMesh.content = content;
    }
    scene.add(towerMesh);

}

export function addPMU(world, scene, position, visuals, content) {

    let building = new CANNON.Body({
        mass: 0,
        material: groundMaterial,
    });
    building.position.copy(position);

    let mainBody = new CANNON.Box(new CANNON.Vec3(21, 10, 8));
    let entrance = new CANNON.Box(new CANNON.Vec3(10, 15, 5));

    building.addShape(mainBody, new CANNON.Vec3(0, 0, 0));
    building.addShape(entrance, new CANNON.Vec3(0, 0, 10));

    world.addBody(building);
    
    building.addEventListener("collide", function (e) {
        ContentManager.updateContent(document, content);
        ContentManager.addCard();
        setTimeout(function () {
            ContentManager.removeCard()
        }, 10000);
    });

    // visuals

    let geometryArray = [];
    const buildingMat = new THREE.MeshNormalMaterial({ color: 0xDEBB19, side: THREE.DoubleSide, wireframe: false, transparent: true, opacity: 0 });

    const mainBodyGeo = new THREE.BoxBufferGeometry(42, 20, 16);
    const mainBodyMesh = new THREE.Mesh(mainBodyGeo, buildingMat);
    mainBodyMesh.updateMatrixWorld();
    geometryArray.push(mainBodyMesh.geometry.clone().applyMatrix4(mainBodyMesh.matrixWorld));

    const entranceGeo = new THREE.BoxBufferGeometry(20, 30, 10);

    const entranceMesh = new THREE.Mesh(entranceGeo, buildingMat);
    entranceMesh.position.copy(new THREE.Vector3(mainBodyMesh.position.x, mainBodyMesh.position.y, mainBodyMesh.position.z + 10));
    entranceMesh.updateMatrix();
    geometryArray.push(entranceMesh.geometry.clone().applyMatrix4(entranceMesh.matrix));

    if (visuals) {
        buildingMat.opacity = 0.5;
    }

    let buildingGeo = new THREE.BufferGeometry();
    buildingGeo = BufferGeometryUtils.mergeBufferGeometries(geometryArray);
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);

    buildingMesh.position.copy(building.position);
    buildingMesh.quaternion.copy(building.quaternion);

    if (typeof content != 'undefined') {
        buildingMesh.content = content;
    }
    scene.add(buildingMesh);

}

export function addStopSigns(world, scene, position, quaternion, index) {
    const stopSign = new CANNON.Body({
        mass: 0.1,
        shape: new CANNON.Box(new CANNON.Vec3(2, 10, 2)),
        material: groundMaterial
    });
    stopSign.position.copy(position);
    stopSign.position.y -= 12
    stopSign.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z);
    world.addBody(stopSign);

    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/StopSign/StopSign.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/StopSign/StopSign.obj', (sign) => {
            scene.add(sign);
            const name = "stopSign" + index;
            sign.name = name;
        });
    });
    return stopSign;
}

export function addCheckPoint(world, scene, position, Vehicle, visuals) {
    const checkpoint = new CANNON.Body({
        mass: 0,
    });
    checkpoint.addShape(new CANNON.Box(new CANNON.Vec3(2, 4, 2)));
    checkpoint.position.copy(position)

    checkpoint.addEventListener('collide', () => {
        console.log("hit")
        checkpoint.position.y -= 100
        setTimeout(() => {
            console.log("back up")
            checkpoint.position.y += 100
        }, 5000)
    })

    world.addBody(checkpoint);

    if (visuals) {
        const checkpointGeo = new THREE.BoxBufferGeometry(4, 8, 4);
        const checkpointMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true });
        const checkpointMesh = new THREE.Mesh(checkpointGeo, checkpointMat);
        checkpointMesh.position.copy(checkpoint.position);
        checkpointMesh.quaternion.copy(checkpoint.quaternion);
        scene.add(checkpointMesh);
    }

}