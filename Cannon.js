import * as CANNON from './build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import {OBJLoader} from './OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from './OrbitControls.js';
import {bodyToMesh} from './three-conversion-util.js'

/**
 * Really basic example to show cannon.js integration
 * with three.js.
 * Each frame the cannon.js world is stepped forward and then
 * the position and rotation data of the boody is copied
 * over to the three.js scene.
 */
    // three.js variables
    let camera, scene, renderer
    let mesh
    let block0, block1, ramp, test
    let car

    // cannon.js variables
    let world
    let body
    let bodyPos
    let block0Physics, block1Physics, rampPhysics
    let chassisBody
    let vehicle
    let wheelBody
    const timeStep = 1 / 60
    let lastCallTime
    const groundMaterial = new CANNON.Material('ground')

    initThree()
    // initCannon()
    // animate()

    function initThree() {
    // Camera
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(75, 300, 50)


    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#CBD9E6');

    // Light
    {
        const skyColor = 0xCBD9E6;  
        const groundColor = 0xE2E2E4;  
        const intensity = 0.7;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
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
    

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize)

    // // Box
    // const geometry = new THREE.BoxBufferGeometry(10, 10, 10)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

    // mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)

    // // Plane
    // let plane = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
    // let mat = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
    // let floor = new THREE.Mesh( plane, mat );
    // floor.material.side = THREE.DoubleSide;
    // floor.rotation.x = Math.PI / 2;
    // scene.add( floor );

    // Block0
    const block0Geo = new THREE.BoxBufferGeometry(66, 75, 62)
    block0 = new THREE.Mesh(block0Geo, material)
    scene.add(block0)

    const block1Geo = new THREE.BoxBufferGeometry(80, 75, 62)
    block1 = new THREE.Mesh(block1Geo, material)
    scene.add(block1)

    const rampGeo = new THREE.BoxBufferGeometry(26, 75, 20)
    ramp = new THREE.Mesh(rampGeo, material)
    scene.add(ramp)

    // Create the visuals of the Car
    // const carGeo = new THREE.BoxBufferGeometry(8, 0.8, 4)
    // const carMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    // car = new THREE.Mesh(carGeo, carMat)
    // console.log("CAR: "+ car)
    // console.log(car)
    // scene.add(car)

    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/Train/11709_train_v1_L3.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/Train/11709_train_v1_L3.obj', (train) => {
            train.rotateX(-Math.PI/2)
            scene.add(train)
            console.log(train)
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("LOADED")
                initCannon()
                animate()
            }
        });
    });


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
    world.broadphase = new CANNON.NaiveBroadphase();
    world.iterations = 10;


    // // Box
    // {
    //     const shape = new CANNON.Box(new CANNON.Vec3(10, 10, 10))
    //     body = new CANNON.Body({
    //         mass: 5,
    //     })
    //     body.addShape(shape)
    //     body.position.set(0, 150, 0)
    //     world.addBody(body)
    //     bodyPos = [0, 10, 0]
    // }

    // // Add a ground body

    // {
        
    //     groundMaterial.friction = 0.3
    //     const groundBody = new CANNON.Body({
    //         mass: 0,
    //         shape: new CANNON.Plane(),
    //         material: groundMaterial,
    //     })
    //     groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0)
    //     world.addBody(groundBody)
    // }

    {



    }


    // Create the physics of the Car
        {
            const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 1))
            chassisBody = new CANNON.Body({ mass: 500 })
            chassisBody.addShape(chassisShape)
            chassisBody.position.set(-80, 100, -50)
            chassisBody.angularVelocity.set(0, 0.5, 0)

            vehicle = new CANNON.RaycastVehicle({
                chassisBody,
                })
        
                const wheelOptions = {
                    radius: 1.5,
                    directionLocal: new CANNON.Vec3(0, -1, 0),
                    suspensionStiffness: 30,
                    suspensionRestLength: 0.1,
                    frictionSlip: 3,
                    dampingRelaxation: 2.3,
                    dampingCompression: 4.4,
                    maxSuspensionForce: 100000,
                    rollInfluence: 0.01,
                    axleLocal: new CANNON.Vec3(0, 0, 2),
                    chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
                    maxSuspensionTravel: 0.3,
                    customSlidingRotationalSpeed: -30,
                    useCustomSlidingRotationalSpeed: true,
                }

                wheelOptions.chassisConnectionPointLocal.set(-3, 0, 2)
                vehicle.addWheel(wheelOptions)
        
                wheelOptions.chassisConnectionPointLocal.set(-3, 0, -2)
                vehicle.addWheel(wheelOptions)
        
                wheelOptions.chassisConnectionPointLocal.set(3, 0, 2)
                vehicle.addWheel(wheelOptions)
        
                wheelOptions.chassisConnectionPointLocal.set(3, 0, -2)
                vehicle.addWheel(wheelOptions)
        
                vehicle.addToWorld(world)

                const wheelBodies = []
                const wheelVisuals = [];
                const wheelMaterial = new CANNON.Material('wheel')
                vehicle.wheelInfos.forEach((wheel) => {
                    const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
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

                    let wheelGeo = new THREE.CylinderGeometry( wheel.radius, wheel.radius, 0.4, 32)
                    wheelGeo.rotateX(Math.PI/2)
                    let wheelMat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        emissive: 0xaa0000,
                        side: THREE.DoubleSide,
                        flatShading: true,
                    })
                    let wheelvisual = new THREE.Mesh(wheelGeo, wheelMat)
                    wheelVisuals.push(wheelvisual)
                    console.log(wheelvisual.rotation)
                    scene.add(wheelvisual)
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

                // Adding physics of the ground

                const heightfieldShape = new CANNON.Plane()
                const heightfieldBody = new CANNON.Body({ mass: 0, material: groundMaterial })
                heightfieldBody.addShape(heightfieldShape)
                heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
                world.addBody(heightfieldBody)

                // Adding visuals of the ground

                const groundGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1)
                const groundMat = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide})
                const groundMesh = new THREE.Mesh(groundGeo, groundMat)
                groundMesh.rotation.x = Math.PI / 2;
                scene.add(groundMesh)

                // Adding physics of block0

                block0Physics = new CANNON.Body({
                    mass: 0,
                    material: groundMaterial
                })
                block0Physics.addShape(new CANNON.Box(new CANNON.Vec3(33, 32.5, 31)))
                console.log(block0Physics)
                block0Physics.position.set(-62, 48.5, -63)
                world.addBody(block0Physics)

                // Adding the visuals of block0

                let test1 = bodyToMesh(block0Physics)
                console.log("BLOCK0")
                test1.children[0].material.color.setHex(0xff0000)
                test1.children[0].material.wireframe = true
                console.log(test1.children[0])

                test = test1.children[0].clone(true)
                console.log(test)

                block1Physics = new CANNON.Body({
                    mass: 0,
                    material: groundMaterial
                })
                block1Physics.addShape(new CANNON.Box(new CANNON.Vec3(40, 32.5, 31)))
                console.log(block1Physics)
                block1Physics.position.set(35, 39, -63)
                world.addBody(block1Physics)


                rampPhysics = new CANNON.Body({
                    mass: 0,
                    material: groundMaterial
                })
                rampPhysics.addShape(new CANNON.Box(new CANNON.Vec3(13, 32.5, 10)))
                console.log("RAMPRAMPRAMPRAMP")
                console.log(rampPhysics)

                rampPhysics.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 7.8)
                rampPhysics.position.set(-30, 46, -50)
                world.addBody(rampPhysics)


                const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
                    friction: 0.5,
                    restitution: 0,
                    contactEquationStiffness: 1000,
                })
                world.addContactMaterial(wheel_ground)
    
       }      
    
        // Add block0
        {
            // block0Physics = new CANNON.Body({
            //     mass: 0,
            //     shape: new CANNON.Box(new CANNON.Vec3(33, 32.5, 31)),
            //     material: groundMaterial
            // })
            // console.log(block0Physics)
            // block0Physics.material.friction = 0.3
            // block0Physics.position.set(-63, 50, -63)
            // world.addBody(block0Physics)
        }

    }


    function animate() {
    requestAnimationFrame(animate)

    // Step the physics world
    updatePhysics()

    // Copy coordinates from cannon.js to three.js
    // mesh.position.copy(body.position)
    // mesh.quaternion.copy(body.quaternion)
    block0.position.copy(block0Physics.position)
    block0.quaternion.copy(block0Physics.quaternion)
    block1.position.copy(block1Physics.position)
    block1.quaternion.copy(block1Physics.quaternion)
    ramp.position.copy(rampPhysics.position)
    ramp.quaternion.copy(rampPhysics.quaternion)
    // car.position.copy(chassisBody.position)
    // car.quaternion.copy(chassisBody.quaternion)
    let a = scene.getObjectById(284, true)


    a.position.copy(chassisBody.position)
    a.quaternion.copy(chassisBody.quaternion)
    a.rotateX(-Math.PI / 2)
    a.rotateZ(Math.PI)
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

    function render() {
    renderer.render(scene, camera)
    }


    document.addEventListener('keydown', (event) => {
    const maxSteerVal = 0.7
    const maxForce = 7000
    const brakeForce = 10000
    console.log(event.key)

    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
        vehicle.applyEngineForce(-maxForce, 2)
        vehicle.applyEngineForce(-maxForce, 3)
        break

        case 's':
        case 'S':
        case 'ArrowDown':
        vehicle.applyEngineForce(maxForce, 2)
        vehicle.applyEngineForce(maxForce, 3)
        break

        case 'a':
        case 'A':
        case 'ArrowLeft':
        vehicle.setSteeringValue(maxSteerVal, 0)
        vehicle.setSteeringValue(maxSteerVal, 1)
        break

        case 'd':
        case 'D':
        case 'ArrowRight':
        vehicle.setSteeringValue(-maxSteerVal, 0)
        vehicle.setSteeringValue(-maxSteerVal, 1)
        break

        case ' ':
        // vehicle.setBrake(brakeForce, 0)
        // vehicle.setBrake(brakeForce, 1)
        vehicle.setBrake(brakeForce, 2)
        vehicle.setBrake(brakeForce, 3)
        break

        case 'r':
        case 'R':
            chassisBody.position.set(-80, 100, -50)
            break;
    }
    })

    // Reset force on keyup
    document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
        vehicle.applyEngineForce(0, 2)
        vehicle.applyEngineForce(0, 3)
        break

        case 's':
        case 'S':
        case 'ArrowDown':
        vehicle.applyEngineForce(0, 2)
        vehicle.applyEngineForce(0, 3)
        break

        case 'a':
        case 'A':
        case 'ArrowLeft':
        vehicle.setSteeringValue(0, 0)
        vehicle.setSteeringValue(0, 1)
        break

        case 'd':
        case 'D':
        case 'ArrowRight':
        vehicle.setSteeringValue(0, 0)
        vehicle.setSteeringValue(0, 1)
        break

        case ' ':
        // vehicle.setBrake(0, 0)
        // vehicle.setBrake(0, 1)
        vehicle.setBrake(0, 2)
        vehicle.setBrake(0, 3)
        break
    }
    })