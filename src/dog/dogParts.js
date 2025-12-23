export function getDogParts(dog) {
  const parts = {};

  dog.traverse((child) => {
    if (!child.isMesh) return;
    parts[child.name] = child;
  });

  return parts;
}
