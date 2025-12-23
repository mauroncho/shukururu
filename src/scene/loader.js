import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function loadDog(scene, controls, camera) {
  const loader = new GLTFLoader();

  return new Promise((resolve) => {
    loader.load("/models/dog.glb", (gltf) => {
      const dog = gltf.scene;
      scene.add(dog);

      const box = new THREE.Box3().setFromObject(dog);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      controls.target.copy(center);

      const distance = Math.max(size.x, size.y, size.z) * 1.2;
      camera.position.set(
        center.x + distance,
        center.y + distance * 0.6,
        center.z + distance
      );

      camera.lookAt(center);
      controls.update();

      resolve(dog);
    });
  });
}
