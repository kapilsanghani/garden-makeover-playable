import { scene, camera, renderer } from './core/scene.js';
import { setupEnvironment } from './core/environment.js';
import { loadGLB } from './core/loader.js';
import { setupUI } from './systems/ui.js';
import { THREE } from '../core/scene.js';

setupEnvironment();

// Load and place one main garden
loadGLB('./assets/garden.glb')
  .then((model) => {
    model.scale.set(0.05, 0.05, 0.05);
    model.position.set(0, 0, 0);
    
    window.gardenModel = model;
    centerModel(model);
    positionAndScaleGarden(model);

    scene.add(model);
    setupUI();
  })
  .catch(console.error);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function centerModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  center.y = 0;
  model.position.sub(center);
}

function positionAndScaleGarden(model) {
  const aspect = window.innerWidth / window.innerHeight;

  const baseScale = 0.05;
  let scaleMultiplier = 1;
  let offsetZ = 0;

  if (aspect < 1.5) {
    // Taller screens (iPads, tablets)
    scaleMultiplier = 0.8;
    offsetZ = -1;
  } else if (aspect > 2) {
    // Ultra-wide desktops
    scaleMultiplier = 1.2;
    offsetZ = 1;
  }

  const finalScale = baseScale * scaleMultiplier;
  model.scale.set(finalScale, finalScale, finalScale);
  model.position.z = offsetZ;
}


window.addEventListener('resize', () => {
  if (window.gardenModel) {
    positionAndScaleGarden(window.gardenModel);
  }
});

animate();
