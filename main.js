const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 500);
camera.position.set(80, 60, 80);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.2;
controls.target.set(0, 5, 0);

scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(100, 200, 100));
scene.add(new THREE.AmbientLight(0xaaaaaa));

const size = 120, seg = 128;
const terrainGeo = new THREE.PlaneGeometry(size, size, seg, seg);
terrainGeo.rotateX(-Math.PI/2);

const terrainMat = new THREE.MeshStandardMaterial({ color: 0x228b22, flatShading: true });
const terrain = new THREE.Mesh(terrainGeo, terrainMat);
scene.add(terrain);

function createTree(x, z) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.5,3), new THREE.MeshStandardMaterial({color:0x8b4513}));
  const leaves = new THREE.Mesh(new THREE.ConeGeometry(2,4,8), new THREE.MeshStandardMaterial({color:0x006400}));
  trunk.position.set(x, 1.5, z); leaves.position.set(x, 4, z);
  scene.add(trunk, leaves);
}
for (let i=0; i<100; i++) createTree((Math.random()-0.5)*size, (Math.random()-0.5)*size);

const params = { amplitude: 10, frequency: 12 };
const gui = new window.lil.GUI();
gui.add(params, 'amplitude', 0, 25, 1).onChange(generateTerrain);
gui.add(params, 'frequency', 5, 30, 1).onChange(generateTerrain);
gui.add({ regenerate: generateTerrain }, 'regenerate');

function generateTerrain() {
  const pos = terrainGeo.attributes.position, count = pos.count;
  for (let i=0; i<count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = params.amplitude * Math.sin(x/params.frequency) * Math.cos(z/params.frequency);
    pos.setY(i, y);
  }
  pos.needsUpdate = true;
  terrainGeo.computeVertexNormals();
}
generateTerrain();

window.addEventListener("resize", () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

(function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();
