import { createScene } from "./scene/scene";
import { createCamera } from "./scene/camera";
import { createRenderer } from "./scene/renderer";
import { setupLights } from "./scene/lights";
import { createControls } from "./scene/controls";
import { loadDog } from "./scene/loader";
import { getDogParts } from "./dog/dogParts";
import { setupDogView } from "./dog/dogSetup";
import * as THREE from "three";
const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = createScene();
const camera = createCamera(sizes);
scene.add(camera);

const renderer = createRenderer(canvas, sizes);
const controls = createControls(camera, canvas);

setupLights(scene);

const dog = await loadDog(scene, controls, camera);
const parts = getDogParts(dog);
console.log(parts);
setupDogView(dog, camera, controls);

/**
 * materiales para estado 1
 */
const blackMaterial = new THREE.MeshStandardMaterial({
  color: "rgb(20, 20, 20)",
  roughness: 0.4,
});
const darkBrownMaterial = new THREE.MeshStandardMaterial({
  color: "rgba(73, 47, 16, 1)",
  roughness: 0.4,
});
const lightBrownMaterial = new THREE.MeshStandardMaterial({
  color: "rgba(133, 100, 63, 1)",
  roughness: 0.4,
});
const redMaterial = new THREE.MeshStandardMaterial({
  color: "rgba(150, 33, 33, 1)",
  roughness: 0.4,
});

parts.body.material = lightBrownMaterial;
parts.inner_ears.material = lightBrownMaterial;
parts.moustache.material = darkBrownMaterial;
parts.mouth.material = darkBrownMaterial;
parts.cloth.material = darkBrownMaterial;
parts.outer_ears.material = darkBrownMaterial;
parts.eyes.material = blackMaterial;
parts.nose.material = blackMaterial;
parts.heart.material = redMaterial;
parts.tounge.material = redMaterial;

//materiales estado 2

// pointer click handling with drag threshold so OrbitControls rotations don't trigger
// let pointerDownPos = null;
// const dragThreshold = 6; // pixels

// canvas.addEventListener("pointerdown", (e) => {
//   pointerDownPos = { x: e.clientX, y: e.clientY };
// });

// canvas.addEventListener("pointerup", (e) => {
//   if (!pointerDownPos) return;
//   const dx = e.clientX - pointerDownPos.x;
//   const dy = e.clientY - pointerDownPos.y;
//   const dist = Math.sqrt(dx * dx + dy * dy);

//   // small movement => treat as click
//   if (dist <= dragThreshold) {
//     const newState = materialController.cycleState();
//     console.log("material state changed to:", newState);
//   }

//   pointerDownPos = null;
// });

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// animate
function tick() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
