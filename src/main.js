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

function applyNormalState(parts) {
  const blackMaterial = new THREE.MeshStandardMaterial({
    color: "rgb(20, 20, 20)",
    roughness: 0.4,
  });

  const darkBrownMaterial = new THREE.MeshStandardMaterial({
    color: "rgb(73, 47, 16)",
    roughness: 0.4,
  });

  const lightBrownMaterial = new THREE.MeshStandardMaterial({
    color: "rgb(133, 100, 63)",
    roughness: 0.4,
  });

  const redMaterial = new THREE.MeshStandardMaterial({
    color: "rgb(150, 33, 33)",
    roughness: 0.4,
  });

  if (parts.body) parts.body.material = lightBrownMaterial;
  if (parts.inner_ears) parts.inner_ears.material = lightBrownMaterial;

  if (parts.moustache) parts.moustache.material = darkBrownMaterial;
  if (parts.mouth) parts.mouth.material = darkBrownMaterial;
  if (parts.cloth) parts.cloth.material = darkBrownMaterial;
  if (parts.outer_ears) parts.outer_ears.material = darkBrownMaterial;

  if (parts.eyes) parts.eyes.material = blackMaterial;
  if (parts.nose) parts.nose.material = blackMaterial;

  if (parts.heart) parts.heart.material = redMaterial;
  if (parts.tonge) parts.tonge.material = redMaterial;
}

/**
 * materiales estado 2
 */

const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0xff20d7) },
    coeficient: { value: 0.03 },
    power: { value: 2.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float coeficient;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      float intensity = pow(coeficient + dot(vNormal, vPositionNormal), power);
      gl_FragColor = vec4(glowColor, intensity);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

function applyGlowState(parts) {
  Object.values(parts).forEach((mesh) => {
    mesh.material = glowMaterial;
  });
}

const materialStates = [
  applyNormalState,
  applyGlowState,
  // applyFutureState ← acá entra el tercero después
];

let currentStateIndex = 0; // arrancás en glow, por ejemplo

function applyCurrentState() {
  materialStates[currentStateIndex](parts);
}
applyCurrentState();

function nextState() {
  currentStateIndex = (currentStateIndex + 1) % materialStates.length;
  applyCurrentState();
}

let pointerDownPos = null;
const dragThreshold = 6;

canvas.addEventListener("pointerdown", (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener("pointerup", (e) => {
  if (!pointerDownPos) return;

  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= dragThreshold) {
    nextState();
  }

  pointerDownPos = null;
});
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
