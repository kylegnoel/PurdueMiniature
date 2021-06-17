import * as CANNON from '../build/cannon-es.js';
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

    // helper visuals for block2
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
    })
    tree.addShape(new CANNON.Box(new CANNON.Vec3(2, 4, 2)))
    tree.position.set(position.x, position.y, position.z)
    world.addBody(tree)

    if (visuals) {
        const treeGeo = new THREE.BoxBufferGeometry(4, 8, 4)
        const treeMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true })
        const treeMesh = new THREE.Mesh(treeGeo, treeMat)
        treeMesh.position.copy(tree.position)
        treeMesh.quaternion.copy(tree.quaternion)
        scene.add(treeMesh)
    }
}

export function addSmallAcademicBuildingPhysics(world, scene, position, quaternion, visuals) {
    const building = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    })
    building.addShape(new CANNON.Box(new CANNON.Vec3(11, 6, 20)))
    building.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z)
    building.position.set(position.x, position.y, position.z)
    world.addBody(building)

    const buildingGeo = new THREE.BoxBufferGeometry(22, 12, 40)
    const buildingMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0 })
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat)
    buildingMesh.position.copy(building.position)
    buildingMesh.quaternion.copy(building.quaternion)

    if (visuals) {
        buildingMat.opacity = 0.5
    }
    scene.add(buildingMesh)

}

export function addBigAcademicBuildingPhysics(world, scene, position, quaternion, visuals, content) {


    const buildingBack = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    })
    buildingBack.addShape(new CANNON.Box(new CANNON.Vec3(15, 6, 12)))
    buildingBack.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z)
    buildingBack.position.set(position.x, position.y, position.z)
    world.addBody(buildingBack)

    const buildingFront = new CANNON.Body({
        mass: 0,
        material: groundMaterial
    })
    buildingFront.addShape(new CANNON.Box(new CANNON.Vec3(8, 6, 12)))
    buildingFront.quaternion.setFromEuler(quaternion.x, quaternion.y, quaternion.z)
    buildingFront.position.set(position.x, position.y, position.z + 10)

    buildingFront.addEventListener("collide", function (e) {
        ContentManager.updateContent(document, content);
        ContentManager.addCard();
        setTimeout(function () {
            ContentManager.removeCard()
        }, 10000)
    })

    world.addBody(buildingFront)

    // Adding some visuals

    const geometryArray = []
    const buildingMat = new THREE.MeshNormalMaterial({ color: 0xDEBB19, side: THREE.DoubleSide, wireframe: false, transparent: true, opacity: 0 })

    const buildingBackGeo = new THREE.BoxBufferGeometry(30, 12, 24)
    const buildingBackMesh = new THREE.Mesh(buildingBackGeo, buildingMat)
    buildingBackMesh.updateMatrixWorld()
    geometryArray.push(buildingBackMesh.geometry.clone().applyMatrix4(buildingBackMesh.matrixWorld))

    const buildingFrontGeo = new THREE.BoxBufferGeometry(16, 12, 24)

    const buildingFrontMesh = new THREE.Mesh(buildingFrontGeo, buildingMat)
    buildingFrontMesh.position.copy(new THREE.Vector3(buildingBackMesh.position.x, buildingBackMesh.position.y + 10, buildingBackMesh.position.z))
    buildingFrontMesh.updateMatrix()
    geometryArray.push(buildingFrontMesh.geometry.clone().applyMatrix4(buildingFrontMesh.matrix))

    if (visuals) {
        buildingMat.opacity = 0.5
    }

    let buildingGeo = new THREE.BufferGeometry()
    buildingGeo = BufferGeometryUtils.mergeBufferGeometries(geometryArray)
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat)

    buildingMesh.position.copy(buildingBack.position)
    buildingMesh.quaternion.copy(buildingBack.quaternion)

    buildingMesh.content = content
    scene.add(buildingMesh)
}