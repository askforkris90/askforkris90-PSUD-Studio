# 3D Adventure Example

A complete **3D platformer** built with Three.js as a demonstration project for **PSUD Studio**.

## Features

- Fully 3D scene with perspective camera
- Custom 3D character (body, head, eyes, animated limbs)
- Dynamic lighting (hemisphere + directional sun + point fill)
- Soft shadows (PCF)
- Physically-based materials (metalness / roughness)
- Platform collision in 3D (AABB)
- Collectible spinning coins with particle bursts
- Hazard spikes
- Lives + invincibility frames
- Smooth third-person camera follow
- Fog + tone mapping for atmosphere
- Win condition (reach the flag)

## Controls

| Key | Action |
|-----|--------|
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `W` / `↑` | Move forward |
| `S` / `↓` | Move back |
| `Space` | Jump |
| `R` | Restart |

## How to Play

```bash
cd examples/3d-adventure
python3 -m http.server 8081
# then open http://localhost:8081
```

Or open `index.html` directly (requires a local server because of ES modules).

## Tech Stack

- **Three.js r170** (via CDN import map)
- WebGL renderer with shadows & ACES tone mapping
- Pure vanilla JS — no build step required

## Concepts → PSUD Modules

| Concept | PSUD Module |
|---------|-------------|
| 3D meshes & materials | `@psud/engine` renderer |
| Lighting & shadows | `@psud/engine` lighting |
| Character controller | `@psud/engine` physics |
| Camera follow | `@psud/scene` |
| Collectibles / VFX | Game logic + particles |

Happy building!
**— PSUD Studio**
