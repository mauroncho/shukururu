import * as THREE from "three";

export function setupLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.position.set(5, 5, 5);

  scene.add(directionalLight);
}
