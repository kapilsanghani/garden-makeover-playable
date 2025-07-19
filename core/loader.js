import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

// Load and return a Promise for a model
export function loadGLB(path) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        resolve(model);
      },
      undefined,
      (error) => {
        reject(`Failed to load ${path}: ${error}`);
      }
    );
  });
}
