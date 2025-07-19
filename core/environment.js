// core/environment.js
import { scene, THREE } from './scene.js';

let sunLight, ambientLight, nightOverlay;

export function setupEnvironment() {
  const loader = new THREE.TextureLoader();
  loader.load('./assets/ui/bg.jpeg', function(texture) {
    scene.background = texture;
  });

  ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(5, 10, 7.5);
  scene.add(sunLight);

  const overlayGeo = new THREE.PlaneGeometry(200, 200);
  const overlayMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.5,
    depthTest: false
  });
  nightOverlay = new THREE.Mesh(overlayGeo, overlayMat);
  nightOverlay.position.set(0, 10, -50);
  nightOverlay.visible = false;
  scene.add(nightOverlay);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );
  ground.name = 'ground';
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);
}

let isDay = true;
export function toggleLighting() {
  isDay = !isDay;

  if (isDay) {
    sunLight.intensity = 1;
    sunLight.color.set(0xffffff);
    ambientLight.intensity = 0.6;
    if (nightOverlay) nightOverlay.visible = false;
  } else {
    sunLight.intensity = 0.3;
    sunLight.color.set(0x9ecfff);
    ambientLight.intensity = 0.2;
    if (nightOverlay) nightOverlay.visible = true;
  }
}

