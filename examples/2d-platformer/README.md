# 2D Platformer Example

A complete, playable 2D platformer built as a demonstration project for **PSUD Studio**.

## Features

- Player movement (left / right / jump)
- Gravity & platform collision
- Collectible coins with particle effects
- Hazard spikes
- Lives system + invincibility frames
- Camera follow
- Win condition (reach the flag)
- Score tracking
- Parallax starfield background

## Controls

| Key | Action |
|-----|--------|
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `W` / `↑` / `Space` | Jump |
| `R` | Restart |

## How to Play

Open `index.html` in any modern browser, or serve the folder:

```bash
# From the example directory
npx serve .
# or
python -m http.server 8080
```

Then open the URL shown (usually http://localhost:3000 or :8080).

## Project Structure

```
2d-platformer/
├── index.html      # Entry point + HUD overlay
├── styles.css      # UI styling (matches PSUD dark theme)
├── game.js         # Full game logic (canvas, physics, entities)
└── README.md       # This file
```

## Concepts Demonstrated

These map directly to PSUD Engine modules:

| Concept | PSUD Module |
|---------|-------------|
| Entity positions & sizes | `@psud/engine` |
| Platform collision | `@psud/engine` physics |
| Input mapping | `@psud/engine` input |
| Camera follow | `@psud/scene` |
| Collectibles / score | Game logic + `@psud/ui` |
| Particles | `@psud/engine` VFX |

## Extending

Try adding:
- Moving platforms
- Enemies with simple patrol AI
- Double-jump or wall-jump
- Multiple levels loaded from JSON
- Sound effects (Web Audio API)

Happy building!
**— PSUD Studio**
