// systems/placement.js
import { THREE, camera, scene, renderer } from '../core/scene.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let currentModelToPlace = null;

window.addEventListener('click', (event) => {
  // 🔒 Ignore clicks on UI
  if (event.target.tagName === 'IMG' || event.target.tagName === 'BUTTON') {
    return;
  }

  if (!currentModelToPlace) return;

  // Convert to Normalized Device Coordinates
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // 🔍 Raycast into the scene (check all children)
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children, true);

  if (hits.length > 0) {
    const point = hits[0].point;

    const clone = currentModelToPlace.clone(true);
    clone.position.copy(point);
    clone.position.y += 0.01; // lift slightly above hit point
    scene.add(clone);
  }
});

export function setItemToPlace(model) {
    console.log('Model set for placement');
    currentModelToPlace = model;
}
