    import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js'
    import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
    import {OBJLoader} from './OBJLoader.js';
    import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
    import {OrbitControls} from './OrbitControls.js';
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
      let block0

      // cannon.js variables
      let world
      let body
      let bodyPos
      let block0Physics
      const timeStep = 1 / 60
      let lastCallTime

      initThree()
      initCannon()
      animate()

      function initThree() {
        // Camera
        const fov = 45;
        const aspect = 2;
        const near = 0.1;
        const far = 2000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(250, 350, 200)


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

        // Box
        const geometry = new THREE.BoxBufferGeometry(10, 10, 10)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // Plane
        let plane = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
        let mat = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
        let floor = new THREE.Mesh( plane, mat );
        floor.material.side = THREE.DoubleSide;
        floor.rotation.x = Math.PI / 2;
        scene.add( floor );

        // Block0
        const block0Geo = new THREE.BoxBufferGeometry(66, 75, 62)
        block0 = new THREE.Mesh(block0Geo, material)
        scene.add(block0)
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      function initCannon() {
        world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -50, 0),
        })

        // Box
        {
            const shape = new CANNON.Box(new CANNON.Vec3(10, 10, 10))
            body = new CANNON.Body({
            mass: 100,
            })
            body.addShape(shape)
            body.position.set(0, 150, 0)
            world.addBody(body)
            bodyPos = [0, 10, 0]
        }

        // Add a ground body

        {
            const groundBody = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
            })
            groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0)
            world.addBody(groundBody)
        }

        {
            block0Physics = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Box(new CANNON.Vec3(33, 32.5, 31)),
            })
            block0Physics.position.set(-63, 45, -63)
            console.log(block0Physics)
            world.addBody(block0Physics)
        }

      }

      function animate() {
        requestAnimationFrame(animate)

        // Step the physics world
        updatePhysics()

        // Copy coordinates from cannon.js to three.js
        mesh.position.copy(body.position)
        mesh.quaternion.copy(body.quaternion)
        block0.position.copy(block0Physics.position)
        block0.quaternion.copy(block0Physics.quaternion)

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

      document.onkeydown = handler;

      function handler(event) {
          let up = (event.type == 'keyup')
          if(!up && event.type !== 'keydown'){
            return;
        }
        switch(event.keyCode) {
            case 38: // forward
                body.position.set(bodyPos[0] + 1, bodyPos[1], bodyPos[2]);
                bodyPos[0] += 1
                break;
            case 40: // backward
                body.position.set(bodyPos[0] - 1, bodyPos[1], bodyPos[2]);
                bodyPos[0] -= 1
                break;
            case 37: // left
                body.position.set(bodyPos[0], bodyPos[1], bodyPos[2] - 1);
                bodyPos[2] -= 1
                break;
            case 39: // right
                body.position.set(bodyPos[0], bodyPos[1], bodyPos[2] + 1);
                bodyPos[2] += 1
            break;
        }
      }