import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "./components/getStarfield.js";

// renderer
let w = window.innerWidth;
let h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

document.body.appendChild(renderer.domElement);

// base scene
const scene = new THREE.Scene();

// camera settings
const fov = 60;
const aspect = w / h;
const near = 0.1;
const far = 30;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;

// light
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// geoms
const loader = new THREE.TextureLoader();
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const sphereGeometry = new THREE.IcosahedronGeometry(1, 12);
const sphereMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("../public/earth/8k_earth_daymap.jpg"),
  specularMap: loader.load("../public/earth/earthspec1k-topaz.jpeg"),
  bumpMap: loader.load("../public/earth/earthbump1k-topaz.jpeg"),
  bumpScale: 1,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
earthGroup.add(sphereMesh);

// night light
const nightLightMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("../public/earth/8k_earth_nightmap.jpg"),
  blending: THREE.AdditiveBlending,
});
const nightLightMesh = new THREE.Mesh(sphereGeometry, nightLightMaterial);
earthGroup.add(nightLightMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);
// wireframe
// const wireMaterial = new THREE.MeshBasicMaterial({
//   color: "lightgrey",
//   wireframe: true,
// });
// const wireMesh = new THREE.Mesh(sphereGeometry, wireMaterial);
// wireMesh.scale.setScalar(1.05);
// sphereMesh.add(wireMesh);

// resizing listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ## render
const renderLoop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
