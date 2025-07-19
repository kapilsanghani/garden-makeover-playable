import { loadGLB } from '../core/loader.js';
import { camera, scene, renderer, THREE } from '../core/scene.js';
import { toggleLighting } from '../core/environment.js';

const items = [
  {
    name: 'tree',
    icon: './assets/ui/tree.png',
    file: './assets/tree.glb',
    scale: 9.5,
    xRatio: 0.27,
    yRatio: 0.69
  },
  {
    name: 'bench',
    icon: './assets/ui/bench.png',
    file: './assets/bench.glb',
    scale: 4,
    xRatio: 0.82,
    yRatio: 0.65
  },
  {
    name: 'flowerpot',
    icon: './assets/ui/flowerpot.png',
    file: './assets/flowerpot.glb',
    scale: 2.0,
    xRatio: 0.18,
    yRatio: 0.80
  }
];

export async function setupUI() {

    function positionButtonOverCanvas(btn, xRatio, yRatio) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = rect.left + rect.width * xRatio;
        const y = rect.top + rect.height * yRatio;

        btn.style.position = 'absolute';
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
    }

    // bouncing effect css
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes bobUpDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
        }
        .bobbing-button {
        animation: bobUpDown 1.5s ease-in-out infinite;
        }`;

    document.head.appendChild(style);

    let itemsPlaced = 0;
    const totalItems = items.length;
    let toggleBtn;

    // adding 3 ui buttons
    items.forEach(async (item, index) => {
        const btn = document.createElement('img');
        btn.src = item.icon;
        btn.style.width = '80px';
        btn.style.height = '80px';
        btn.style.position = 'absolute';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '12px';
        btn.style.background = '#ffffffcc';
        btn.classList.add('bobbing-button');
        
        positionButtonOverCanvas(btn, item.xRatio, item.yRatio);
        item.domElement = btn;

        btn.onclick = async () => {
            const model = await loadGLB(item.file);

            // Normalize + scale
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const normalizeSize = 1.5;
            const scaleFactor = normalizeSize / maxDim;

            model.scale.set(0.001, 0.001, 0.001);
            gsap.to(model.scale, {
                x: scaleFactor * item.scale,
                y: scaleFactor * item.scale,
                z: scaleFactor * item.scale,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });

            const canvasRect = renderer.domElement.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();

            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;

            const relativeX = (centerX - canvasRect.left) / canvasRect.width;
            const relativeY = (centerY - canvasRect.top) / canvasRect.height;

            const ndc = new THREE.Vector2(
                relativeX * 2 - 1,
                -(relativeY * 2 - 1)
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(ndc, camera);

            const ground = scene.getObjectByName('ground');
            if (!ground) return;

            const intersects = raycaster.intersectObject(ground);
            if (intersects.length === 0) return;

            const spawnPos = intersects[0].point.clone();
            spawnPos.y += 0.1;
            model.position.copy(spawnPos);

            scene.add(model);

            // Hide button after placing
            btn.style.display = 'none';

            itemsPlaced++;
            if (itemsPlaced >= totalItems) {
                ctaBtn.style.display = 'block';
                if (toggleBtn) toggleBtn.style.display = 'none';
            }
        };

        document.body.appendChild(btn);

        requestAnimationFrame(() => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Convert screen coords to Normalized Device Coordinates
            const ndc = new THREE.Vector2((centerX / window.innerWidth) * 2 - 1, -(centerY / window.innerHeight) * 2 + 1);

            // Setup raycaster
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(ndc, camera);

            const ground = scene.getObjectByName('ground');
            if (!ground) return;

            const intersects = raycaster.intersectObject(ground);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                item.position = point.clone();
            }
        });
    });

    const toggleButtonRatio = { x: 0.92, y: 0.04 };

    //add Day/Night Toggle Button
    toggleBtn = document.createElement('img');
    toggleBtn.src = './assets/ui/toggle_day_night.png';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.width = '8vh';
    toggleBtn.style.height = 'auto';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.zIndex = '10';

    positionButtonOverCanvas(toggleBtn, toggleButtonRatio.x, toggleButtonRatio.y);

    toggleBtn.onclick = () => {
        toggleLighting();
    };

    document.body.appendChild(toggleBtn);

    const ctaButtonRatio = { x: 0.85, y: 0.85 };
    let ctaClicked = false;

    //add CTA button
    const ctaBtn = document.createElement('img');
    ctaBtn.src = './assets/ui/cta_play.png';
    ctaBtn.style.position = 'absolute';
    ctaBtn.style.width = '240px';
    ctaBtn.style.height = 'auto';
    ctaBtn.style.cursor = 'pointer';
    ctaBtn.style.display = 'none';
    ctaBtn.style.zIndex = '10';
    ctaBtn.classList.add('bobbing-button');
    ctaBtn.onclick = () => {
        if (ctaClicked) return;
        ctaClicked = true;
        
        ctaBtn.style.opacity = '0.5';
        ctaBtn.style.pointerEvents = 'none';
        window.open('https://www.google.com', '_blank');
    };
    document.body.appendChild(ctaBtn);
    positionButtonOverCanvas(ctaBtn, ctaButtonRatio.x, ctaButtonRatio.y);

    window.addEventListener('resize', () => {
        items.forEach((item) => {
            if (item.domElement) {
                positionButtonOverCanvas(item.domElement, item.xRatio, item.yRatio);
            }
        });

        if (toggleBtn) {
            positionButtonOverCanvas(toggleBtn, toggleButtonRatio.x, toggleButtonRatio.y);
        }

        if (ctaBtn) {
            positionButtonOverCanvas(ctaBtn, ctaButtonRatio.x, ctaButtonRatio.y);
        }
    });
}