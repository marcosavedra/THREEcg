import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' //permite que a camera orbite em torno de um alvo 
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"; //para a importaçao dos modelos 3d
import * as dat from 'dat.gui' //permite adicionar os controles de interação do usuario com a cena 

//Variavel (para animação)
let cloud

// para add controles de interação
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Loader
const loader = new GLTFLoader();
loader.load(
    // importando cenario - fazenda 
    'scene.gltf',
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
    // chamado no carregamento do loader.
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% carregado' );
        },
     // chamado quando há erros no loader do objeto
        function ( error ) {
            console.log( 'Ocorreu um erro' );
        }
);


loader.load(
    // importando nuvem
    'cloud.gltf',
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = false;
            }
        
        })
        root.position.set(-50,80,50) //(17,50,50)

        const scale = 7
        //root.rotateX(-2.5708)
        root.rotateY(2.5708)
        root.scale.set(scale, scale , scale)
        cloud = root
        // console.log(root.getWorldPosition())
        scene.add( root );

    },
    // chamado no carregamento do loader.
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% carregado' );
    },
    // chamado quando há erros no loader do objeto
    function ( error ) {
        console.log( 'Ocorreu um erro' );
    }
);


//configuração de iluminação de cena
  {
    const skyColor = 0xB1E1FF;  // azul claro
    const groundColor = 0xB97A20;  // laranja acastanhado
    const intensity = 0.6;
    const light2 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light2);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(0.44, 16.2, 12.8); 
    light.target.position.set(0, 0, 0); // foco da luz

    light.shadow.bias = -0.004;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    scene.add(light.target);
    //adicionando controles da iluminação de cena
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


//config de tamanhos
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // atualizando tamanhos
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // atualizando camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // atualizando renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//camera
const camera = new THREE.PerspectiveCamera(110, sizes.width / sizes.height, 0.9, 120)
camera.position.set(45,45,-50)

scene.add(camera)
// Controles de orbita
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true; //renderiza mapas de sombra dos objetos
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor( 0xaddaff, 1);

//Animação
const clock = new THREE.Clock()

let moveSpeed = 0.08

const animacao = () =>
{
    // atualizando a movimentação da nuvem
    if(cloud){
        if(cloud.position.y >= 60) 
        {
            moveSpeed *= -1
        } 
        if(cloud.position.y <= 80)
        {
            moveSpeed *= -1
        }
        cloud.position.y += moveSpeed //gerando movimento de subir e descer. 
    }

    const elapsedTime = clock.getElapsedTime()

    //atualizando controles de orbita da camera
    controls.update()

    // Renderizador
    renderer.render(scene, camera)

    // chama a animacao novamente para o próximo frame 
    window.requestAnimationFrame(animacao)
}

animacao()
