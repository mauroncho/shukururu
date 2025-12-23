# Copilot instructions for shukururu

Purpose: brief, actionable guidance so an AI coding agent can be immediately productive in this repo.

## Big picture (what this app is)

- Small single-page Three.js demo built with Vite. Entry: `src/main.js`.
- Core idea: create a Three.js scene, load `public/models/dog.glb`, frame the camera on the dog, and allow user orbit controls.

## Important files & responsibilities

- `src/main.js` — orchestrates app startup (scene/camera/renderer/controls + loads dog, starts animation loop). Note: uses top-level `await` when loading the GLTF.
- `src/scene/*` — reusable constructors:
  - `createScene()` (`scene.js`)
  - `createCamera(sizes)` (`camera.js`) — uses PerspectiveCamera (75, near 0.1, far 100)
  - `createRenderer(canvas, sizes)` (`renderer.js`) — enables shadows and clamps device pixel ratio
  - `setupLights(scene)` (`lights.js`) — adds Ambient + Directional lights
  - `createControls(camera, canvas)` (`controls.js`) — OrbitControls with damping and distance limits
  - `loadDog(scene, controls, camera)` (`loader.js`) — loads `/models/dog.glb` via `GLTFLoader` and positions camera/controls around dog
- `src/dog/*` — dog helpers
  - `getDogParts(dog)` (`dogParts.js`) — returns an object mapping mesh `name` → Mesh (useful for per-part manipulation)
  - `setupDogView(dog, camera, controls)` (`dogSetup.js`) — utility to frame the dog (similar logic to loader)
- `public/models/dog.glb` — the GLTF model; assets are served from `public/` at runtime.

## How to run / developer workflows

- Start dev server: `npm run dev` (Vite) — open http://localhost:5173 (default) to view.
- Build for production: `npm run build` then `npm run preview` to serve build locally.
- Hot reload: edit files under `src/` and Vite will reload the page.
- Static assets: place under `public/` and reference them with absolute paths (e.g., `/models/your-model.glb`).

## Project-specific patterns & conventions

- Named exports are used consistently (no default exports); prefer adding named functions to the relevant folder (e.g., add new scene utilities to `src/scene/`).
- Functions return constructed Three.js objects (e.g., `createCamera`, `createRenderer`) — follow this factory pattern.
- The loader positions the camera based on a Box3 of the loaded object; keep that behavior if adding other models.
- Camera and OrbitControls have explicit min/max distances (0.3 / 1). If adjusting zoom behavior, update `controls.minDistance`/`maxDistance`.
- Mesh selection: `getDogParts(dog)` uses `child.name` to key meshes — ensure exported GLTF mesh `name` fields are meaningful for downstream manipulations.
- Top-level `await` is used in `src/main.js` (Vite supports it). Avoid converting the app to callbacks unless necessary.

## Integration points & gotchas

- GLTFLoader path: hard-coded to `/models/dog.glb` — if you move models, update this path (or parametrize `loadDog`).
- Renderer pixel ratio clamped with `Math.min(window.devicePixelRatio, 2)` to avoid performance spikes on high-DPI screens.
- No resize handler is present — if adding responsive behavior, update `camera.aspect`, `camera.updateProjectionMatrix()`, and `renderer.setSize()` on `window.resize`.

## Useful quick edits & examples

- Add a new post-processing pass: create a module under `src/scene/` and instantiate it in `src/main.js` before animation loop.
- Accessing dog parts example:
  - After load: `const parts = getDogParts(dog); console.log(parts['LeftEar']);`
- To change the light intensity: update values in `src/scene/lights.js` (ambient intensity `2.4` and directional `1.8` are current defaults).

## Testing & debugging notes

- There are no tests in repo; use browser DevTools and console logs to inspect loaded `gltf.scene` and mesh names.
- Use `console.log(getDogParts(dog))` to discover mesh names for animation or interaction code.

## When in doubt

- Start from `src/main.js` to follow the app flow. Check `src/scene` for reusable pieces and `public/models/` for assets.

---

If you'd like, I can iterate on wording, add examples for common edits (e.g., adding GUI controls or animation hooks), or include recommended PR checklist items—what else should I include? ✅
