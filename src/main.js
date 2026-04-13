import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "./components/getStarfield.js";
import { getFresnelMat } from "./components/getFresnelMat.js";
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
const FOV = 60;
const ASPECT = w / h;
const NEAR = 0.1;
const FAR = 1000;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.z = 3;

// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;

// geoms
const loader = new THREE.TextureLoader();
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const sphereGeometry = new THREE.IcosahedronGeometry(1, 12);
const sphereMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/src/textures/earth/8k_earth_daymap.jpg"),
  specularMap: loader.load("/src/textures/earth/earthspec1k-topaz.jpeg"),
  bumpMap: loader.load("/src/textures/earth/earthbump1k-topaz.jpeg"),
  bumpScale: 1,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
earthGroup.add(sphereMesh);

// night lights
const nightLightMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/src/textures/earth/8k_earth_nightmap.jpg"),
  blending: THREE.AdditiveBlending,
});
const nightLightMesh = new THREE.Mesh(sphereGeometry, nightLightMaterial);

// clouds
const clouds = new THREE.MeshStandardMaterial({
  map: loader.load("/src/textures/earth/8k_earth_clouds.jpg"),
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(sphereGeometry, clouds);
cloudsMesh.scale.setScalar(1.002);
earthGroup.add(nightLightMesh);
earthGroup.add(cloudsMesh);

// stars
const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

// fresnel init
const fresnelMaterial = getFresnelMat();
const glowMesh = new THREE.Mesh(sphereGeometry, fresnelMaterial);
glowMesh.scale.setScalar(1.005);
earthGroup.add(glowMesh);

// light
const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// resizing listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ## render
const renderLoop = () => {
  cloudsMesh.rotation.y += 0.00002;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
