// preciso de uma cena, camera e um renderizador
// cena
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// renderizador
const renderer = new THREE.WebGLRenderer();
// Tamanho da Tela
renderer.setSize(window.innerWidth, window.innerHeight);
// Linkando o renderizador
document.body.appendChild(renderer.domElement);


// Cubo
const geometry = new THREE.BoxGeometry();
// Decarando o material do cubo
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// Aplicando o material
const cube = new THREE.Mesh(geometry, material);
// Adicionando o cubo a Tela
scene.add(cube);


//Configurando a profundidade da camera
cameraa.position.z = 5

function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera);
}
animate();
