import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// renderer
let w = window.innerWidth;
let h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// base scene
const scene = new THREE.Scene();

// camera settings
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// light
const light = new THREE.HemisphereLight("white", "black");
scene.add(light);

// geoms
const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  flatShading: true,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// wireframe
const wireMaterial = new THREE.MeshBasicMaterial({
  color: "lightgrey",
  wireframe: true,
});
const wireMesh = new THREE.Mesh(sphereGeometry, wireMaterial);
wireMesh.scale.setScalar(1.05);
sphereMesh.add(wireMesh);

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
