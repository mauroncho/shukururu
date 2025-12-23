import * as THREE from "three";

export function createCamera(sizes) {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  return camera;
}
