// core/scene.js
import * as THREE from 'https://esm.sh/three@0.160.0';

const WIDTH = 1920;
const HEIGHT = 1080;

// Create scene
const scene = new THREE.Scene();

// Setup camera
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(0, 5, 10);

// Setup renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('gardenCanvas'),
  antialias: true
});
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(window.devicePixelRatio);

export { scene, camera, renderer, THREE };
