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
    let engineeringFountainMesh

    // cannon.js variables
    let world
    let body
    let bodyPos
    let block0Physics, block1Physics, rampPhysics1, engineeringFountain
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
        const fov = 75;
        const aspect = window.innerWidth/ window.innerHeight;
        const near = 0.1;
        const far = 2000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(20, 150, 20)
        


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
        // const block0Geo = new THREE.BoxBufferGeometry(66, 75, 62)
        // block0 = new THREE.Mesh(block0Geo, material)
        // scene.add(block0)



        // const rampGeo = new THREE.BoxBufferGeometry(26, 75, 20)
        // ramp = new THREE.Mesh(rampGeo, material)
        // scene.add(ramp)

        // Create the visuals of the Car
        // const carGeo = new THREE.BoxBufferGeometry(8, 0.8, 4)
        // const carMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        // car = new THREE.Mesh(carGeo, carMat)
        // console.log("CAR: "+ car)
        // console.log(car)
        // scene.add(car)

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



    // Create the physics of the Car

    const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 1))
    chassisBody = new CANNON.Body({ mass: 700 })
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(-80, 100, -50)
    chassisBody.angularVelocity.set(0, 0, 0)
    chassisBody.quaternion.setFromEuler(0, Math.PI, 0)

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

        wheelOptions.chassisConnectionPointLocal.set(2.5, 0, 2)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(2.5, 0, -2)
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
                color: 0x000000,
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


    // Adding physics of the world
    {
        // Adding physics of the ground
        {   
            // const heightfieldShape = new CANNON.Plane()
            // const heightfieldBody = new CANNON.Body({ mass: 0, material: groundMaterial })
            // heightfieldBody.addShape(heightfieldShape)
            // heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
            // world.addBody(heightfieldBody)
        }

        // Adding visuals of the ground
        {        
            // const groundGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1)
            // const groundMat = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide})
            // const groundMesh = new THREE.Mesh(groundGeo, groundMat)
            // groundMesh.rotation.x = Math.PI / 2;
            // scene.add(groundMesh)
        }
        // Adding physics of block0
        {
            block0Physics = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            block0Physics.addShape(new CANNON.Box(new CANNON.Vec3(33, 32.5, 31)))
            block0Physics.position.set(-62, 48.5, -63)
            world.addBody(block0Physics)
        }

        // Adding physics of block1
        {
            block1Physics = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            block1Physics.addShape(new CANNON.Box(new CANNON.Vec3(43, 32.5, 35)))
            block1Physics.position.set(33, 38.5, -65)
            world.addBody(block1Physics)

            // Helper visuals for block1
            const block1Geo = new THREE.BoxBufferGeometry(86, 65, 70)
            const block1Mat = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            block1 = new THREE.Mesh(block1Geo, block1Mat)
            block1.position.copy(block1Physics.position)
            block1.quaternion.copy(block1Physics.quaternion)
            scene.add(block1)
        }

        // Adding physics of block2
        {
            const block2Physics = new CANNON.Body({
                mass: 0,
                material: groundMaterial,
            })
            block2Physics.addShape(new CANNON.Box(new CANNON.Vec3(50, 50, 58)))
            block2Physics.position.set(73, 13, 42)
            world.addBody(block2Physics)
            
            // helper visuals for block2

            const block2Geo = new THREE.BoxBufferGeometry(100, 100, 116)
            const block2Mat = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            const block2Mesh = new THREE.Mesh(block2Geo, block2Mat)
            block2Mesh.position.copy(block2Physics.position)
            block2Mesh.quaternion.copy(block2Physics.quaternion)
            scene.add(block2Mesh)

        }


        // Adding Physics of ramp0
        {
            rampPhysics1 = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            rampPhysics1.addShape(new CANNON.Box(new CANNON.Vec3(13, 32.5, 10)))
    
    
            rampPhysics1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 7.8)
            rampPhysics1.position.set(-30, 46, -50)
            world.addBody(rampPhysics1)
        }

        // Adding physics of ramp1
        {
            const rampPhysics2 = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            rampPhysics2.addShape(new CANNON.Box(new CANNON.Vec3(13, 32.5, 10.2)))
    
            rampPhysics2.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 8)
            rampPhysics2.position.set(63, 37.05, -33)
            world.addBody(rampPhysics2)

            const ramp2Geo = new THREE.BoxBufferGeometry(26, 65, 20.4)
            const ramp2Mat = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            const ramp2Mesh = new THREE.Mesh(ramp2Geo, ramp2Mat)

            ramp2Mesh.position.copy(rampPhysics2.position)
            ramp2Mesh.quaternion.copy(rampPhysics2.quaternion)
            scene.add(ramp2Mesh)

        }


        // Adding the physics of the interaction/behavior between the wheel material and the ground material
        {
            const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
                friction: 0.8,
                restitution: 0,
                contactEquationStiffness: 1000,
            })
            world.addContactMaterial(wheel_ground)
        }

        // Adding the physics of the gateway to the future
        {
            const gatewayPillar0 = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            gatewayPillar0.addShape(new CANNON.Box(new CANNON.Vec3(6, 6, 20)))
            gatewayPillar0.quaternion.setFromEuler(Math.PI / 2, 0, 0)
            gatewayPillar0.position.set(-90, 100, -63)
            world.addBody(gatewayPillar0)

            // add helper visual for pillar0
            // const pillar0Geo = new THREE.BoxBufferGeometry(12, 12, 40)
            // const pillar0Mat = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            // const pillar0Mesh = new THREE.Mesh(pillar0Geo, pillar0Mat)
            // pillar0Mesh.position.copy(gatewayPillar0.position)
            // pillar0Mesh.quaternion.copy(gatewayPillar0.quaternion)
            // scene.add(pillar0Mesh)

            const gatewayPillar1 = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            gatewayPillar1.addShape(new CANNON.Box(new CANNON.Vec3(6, 6, 20)))
            gatewayPillar1.quaternion.setFromEuler(Math.PI/2, 0, 0)
            gatewayPillar1.position.set(-90, 100, -37)
            world.addBody(gatewayPillar1)

            // add helper visual for pillar1
            // const pillar1Mesh = new THREE.Mesh(pillar0Geo, pillar0Mat)
            // pillar1Mesh.position.copy(gatewayPillar1.position)
            // pillar1Mesh.quaternion.copy(gatewayPillar1.quaternion)
            // scene.add(pillar1Mesh)
        }

        // Adding physics to the buildings in block0
        {
            const bigAcademicBuildingAtBlock0Back = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            bigAcademicBuildingAtBlock0Back.addShape(new CANNON.Box(new CANNON.Vec3(15, 6, 20)))
            bigAcademicBuildingAtBlock0Back.quaternion.setFromEuler(Math.PI / 2, 0, 0)
            bigAcademicBuildingAtBlock0Back.position.set(-45, 100, -85)
            world.addBody(bigAcademicBuildingAtBlock0Back)
            
            // Helper visuals for BigAcademicBuildingAtBlock0

            // const bigAcademicBuildingAtBlock0GeoBack = new THREE.BoxBufferGeometry(30, 12, 40)
            // const bigAcademicBuildingAtBlock0MatBack = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            // const bigAcademicBuildingAtBlock0MeshBack = new THREE.Mesh(bigAcademicBuildingAtBlock0GeoBack, bigAcademicBuildingAtBlock0MatBack)
            // bigAcademicBuildingAtBlock0MeshBack.position.copy(bigAcademicBuildingAtBlock0Back.position)
            // bigAcademicBuildingAtBlock0MeshBack.quaternion.copy(bigAcademicBuildingAtBlock0Back.quaternion)
            // scene.add(bigAcademicBuildingAtBlock0MeshBack)

            const bigAcademicBuildingAtBlock0Front = new CANNON.Body({
                mass: 0,
                material: groundMaterial
            })
            bigAcademicBuildingAtBlock0Front.addShape(new CANNON.Box(new CANNON.Vec3(8, 6, 20)))
            bigAcademicBuildingAtBlock0Front.quaternion.setFromEuler(Math.PI / 2, 0, 0)
            bigAcademicBuildingAtBlock0Front.position.set(-45, 100, -75)
            bigAcademicBuildingAtBlock0Front.addEventListener("collide", function(e) {
                // document.getElementById("textBox0").style.display = "block"
                document.getElementById("textBox0").classList.add("popShow")
                document.getElementById("textBox0").classList.remove("popHide")
                world.addEventListener('endContact', () => {
                    // document.getElementById("textBox0").style.display = "block"
                    setTimeout(function() {
                        // document.getElementById("textBox0").style.display = "none"
                        document.getElementById("textBox0").classList.remove("popShow")
                        document.getElementById("textBox0").classList.add("popHide")
                    }, 2000)
                })
            })
       
            world.addBody(bigAcademicBuildingAtBlock0Front)

            // const bigAcademicBuildingAtBlock0GeoFront = new THREE.BoxBufferGeometry(16, 12, 40)
            // const bigAcademicBuildingAtBlock0MatFront = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, wireframe: true})
            // const bigAcademicBuildingAtBlock0MeshFront = new THREE.Mesh(bigAcademicBuildingAtBlock0GeoFront, bigAcademicBuildingAtBlock0MatFront)
            // bigAcademicBuildingAtBlock0MeshFront.position.copy(bigAcademicBuildingAtBlock0Front.position)
            // bigAcademicBuildingAtBlock0MeshFront.quaternion.copy(bigAcademicBuildingAtBlock0Front.quaternion)
            // scene.add(bigAcademicBuildingAtBlock0MeshFront)


        }

        // Adding engineering fountain

        {
            engineeringFountain = new CANNON.Body({
                mass: 50,
                shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5))
            })
            engineeringFountain.position.set(55, 77, -65)
            world.addBody(engineeringFountain)

            const mtlLoader = new MTLLoader();
            mtlLoader.load('models/EngineeringFountain/EngineeringFountain.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('models/EngineeringFountain/EngineeringFountain.obj', (fountain) => {
                    scene.add(fountain)
                    fountain.name = "engineeringFountain"
                    console.log(fountain)
                }, (xhr) => {
                    if (xhr.loaded / xhr.total == 1) {
                        console.log("LOADED")
                    }
                });
            });
    

        }



    }
        


    }


    function animate() {
    requestAnimationFrame(animate)

    // Step the physics world
    updatePhysics()

    // Copy coordinates from cannon.js to three.js
    // mesh.position.copy(body.position)
    // mesh.quaternion.copy(body.quaternion)
    // block0.position.copy(block0Physics.position)
    // block0.quaternion.copy(block0Physics.quaternion)
    // block1.position.copy(block1Physics.position)
    // block1.quaternion.copy(block1Physics.quaternion)
    // ramp.position.copy(rampPhysics1.position)
    // ramp.quaternion.copy(rampPhysics1.quaternion)
    // car.position.copy(chassisBody.position)
    // car.quaternion.copy(chassisBody.quaternion)

    let fountain = scene.getObjectByName("engineeringFountain", true)
    fountain.position.copy(engineeringFountain.position)
    fountain.quaternion.copy(engineeringFountain.quaternion)
    fountain.position.y -= 5

    
    let train = scene.getObjectByName("train", true)


    train.position.copy(chassisBody.position)
    train.quaternion.copy(chassisBody.quaternion)
    camera.position.z = chassisBody.position.z + 50
    camera.position.x = chassisBody.position.x + 50
    camera.position.y = chassisBody.position.y + 60
    camera.lookAt(new THREE.Vector3(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z))
    train.rotateY(Math.PI)
    train.position.y -= 0.5


    if (train.position.y < -100) {
        chassisBody.position.set(-80, 90, -50)
        chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
        chassisBody.angularVelocity.set(0,0,0)
        chassisBody.velocity.set(0,0,0)
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

    function render() {
    renderer.render(scene, camera)
    }


    document.addEventListener('keydown', (event) => {
    const maxSteerVal = 0.7
    const maxForce = 6000
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
            vehicle.setBrake(brakeForce, 2)
            vehicle.setBrake(brakeForce, 3)
            break
        
        case 'q':
            chassisBody.velocity.y = 100
            break

        case 'r':
        case 'R':
            chassisBody.position.set(-80, 90, -50)
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
            chassisBody.angularVelocity.set(0,0,0)
            chassisBody.velocity.set(0,0,0)
            console.log(chassisBody)
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

        case 'q':
            chassisBody.velocity.y = -5
        break

        case ' ':
        // vehicle.setBrake(0, 0)
        // vehicle.setBrake(0, 1)
        vehicle.setBrake(0, 2)
        vehicle.setBrake(0, 3)
        break
    }
    })