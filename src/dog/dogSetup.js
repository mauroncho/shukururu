import * as THREE from "three";

/**
 * Ajusta cámara y OrbitControls para encuadrar al perrito
 */
export function setupDogView(dog, camera, controls) {
  const box = new THREE.Box3().setFromObject(dog);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // OrbitControls gira alrededor del centro del perrito
  controls.target.copy(center);

  // Distancia ideal de cámara
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1.2;

  camera.position.set(
    center.x + distance,
    center.y + distance * 0.6,
    center.z + distance
  );

  camera.lookAt(center);
  controls.update();
}
