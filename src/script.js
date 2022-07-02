import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'dat.gui'

//Var's
let cloud

// Debug
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

//Loader
const loader = new GLTFLoader();
loader.load(
    // resource URL
    'scene.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
        })
        root.position.set(0,3,0)
        const scale = 1
        root.rotateY(7.0508)
        root.scale.set(scale, scale , scale)
        scene.add( root );

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

// Load a glTF resource -> Cloud
loader.load(
    // resource URL
    'cloud.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = false;
            }
        
        })
        root.position.set(-50,80,50) //(17,50,50)

        const scale = 8
        //root.rotateX(-2.5708)
        root.rotateY(2.5708)
        root.scale.set(scale, scale , scale)
        cloud = root
        // console.log(root.getWorldPosition())
        scene.add( root );

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

// Load a glTF resource -> Man
/*loader.load(
    // resource URL
    'man.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = false;
            }
        
        })
        root.position.set(-2.7,9.4,64)
        const scale = 1.3
        root.rotateY(-1.1)
        root.scale.set(scale, scale , scale)
        scene.add( root );

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);*/


// Lights:
// Light 1
/*const luzAmbiente = new THREE.AmbientLightProbe(0x858585, 2.5)
scene.add(luzAmbiente)*/

/*//Light 2
const pointLight = new THREE.PointLight(0xc9671c, 3)
pointLight.position.set(-30,36,32)
pointLight.castShadow = true
pointLight.shadow.bias = -0.0004

const helper = new THREE.PointLightHelper(pointLight, 1)
scene.add(helper)
scene.add(pointLight)
gui.add(pointLight.position, 'x').min(-30).max(30).step(0.01)
gui.add(pointLight.position, 'y').min(0).max(30).step(0.01)
gui.add(pointLight.position, 'z').min(-30).max(30).step(0.01)
gui.add(pointLight, 'intensity').min(0).max(10).step(0.1)*/

//Light 3
/*const pointLight2 = new THREE.PointLight(0x808eff, 0.6)
pointLight2.position.set(0,60,67)
pointLight2.castShadow = true
pointLight2.shadow.bias = -0.0004
const helper2 = new THREE.PointLightHelper(pointLight2, 1)
scene.add(helper2)
scene.add(pointLight2)*/


  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.6;
    const light2 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light2);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(0, 0, 10); //onde  a luz...
    light.target.position.set(0, 0, 0); // foco da luz

    light.shadow.bias = -0.004;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    scene.add(light.target);
    gui.add(light.position, 'x').min(-30).max(30).step(0.01)
    gui.add(light.position, 'y').min(0).max(30).step(0.01)
    gui.add(light.position, 'z').min(-30).max(30).step(0.01)
    gui.add(light, 'intensity').min(0).max(10).step(0.1)


    const cam = light.shadow.camera;
    cam.near = 1;
    cam.far = 2000;
    cam.left = -1500;
    cam.right = 1500;
    cam.top = 1500;
    cam.bottom = -1500;
}


//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(110, sizes.width / sizes.height, 0.1, 120)
camera.position.set(40,30,-30)

scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor( 0xaddaff, 1);

//Animate
const clock = new THREE.Clock()

let moveSpeed = 0.08

const tick = () =>
{
    // Update objects
    if(cloud){
        if(cloud.position.z >= 43)
        {
            moveSpeed *= -1
        }
        if(cloud.position.z <= 68)
        {
            moveSpeed *= -1
        }
        cloud.position.z += moveSpeed
    }

    const elapsedTime = clock.getElapsedTime()

    //Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
