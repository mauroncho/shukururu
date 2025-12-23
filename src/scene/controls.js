import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.minDistance = 0.3;
  controls.maxDistance = 1;
  return controls;
}
