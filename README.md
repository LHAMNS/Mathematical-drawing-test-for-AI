# Mechanical Clock Mechanism Explorer

This is a pure front-end 3D education experience that demonstrates how a mainspring-driven desk clock works. It procedurally generates every component (gears, barrel, escapement, balance wheel, dial) and animates the energy transfer chain with bilingual explanations, camera choreography, and LaTeX formulas.

## Mechanism assumptions
- Escapement type: anchor escapement (pallet fork + escape wheel).
- Oscillator: balance wheel with hairspring.
- Gear train: mainspring barrel → center wheel → third wheel → fourth wheel → escape wheel.
- Motion works: simplified reduction between wheel train output and dial hands.
- Dial: hour, minute, and seconds hands.
- Gear teeth (driving pinions): barrel pinion 28T → center 64T → center pinion 24T → third 48T → third pinion 20T → fourth 32T → fourth pinion 16T → escape 15T.

## Project structure
```
.
├── docs
│   └── DEPENDENCY_REPORT.md
├── index.html
├── package.json
├── package-lock.json
├── src
│   ├── main.ts
│   ├── scene
│   │   ├── AnimationSystem.ts
│   │   ├── ClockModel.ts
│   │   ├── GearFactory.ts
│   │   ├── Materials.ts
│   │   └── SceneManager.ts
│   ├── styles
│   │   └── main.css
│   ├── ui
│   │   ├── UIController.ts
│   │   └── segments.ts
│   └── utils
│       ├── dom.ts
│       └── math.ts
├── tsconfig.json
└── vite.config.ts
```

## Requirements
- Node.js 18+
- npm 9+

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Preview
```bash
npm run preview
```

## Controls
- **Mouse drag**: orbit the camera around the movement.
- **Mouse wheel**: zoom in/out.
- **Space**: play/pause narration.
- **Left/Right arrows**: previous/next segment.
- **UI buttons**: play, navigation, reset, speed.
- **X-Ray**: make non-focused parts semi-transparent.
- **Explode**: slightly separate components for inspection.
- **Labels**: toggle bilingual component labels.

## Segment flow (Energy → Transmission → Regulation → Display)
1. Intro (overview)
2. Case opening
3. Mainspring energy storage
4. Gear train transmission
5. Escapement stepping
6. Balance & hairspring oscillation
7. Motion works reduction
8. Dial & hands display
9. Summary chain

## Self-check checklist
- [x] `npm install` succeeds.
- [x] `npm run dev` starts the dev server.
- [x] `npm run build` completes without errors.
- [x] Page loads with zero console errors.
- [x] Auto playback completes end-to-end.
- [x] Each component button focuses and updates the explanation.
- [x] Case removal animation plays during the “Case Opening” segment.
- [x] Gear directions and ratios match the segment formulas.
- [x] Math formulas render locally (KaTeX).
- [x] No external models, textures, or network requests.

## Notes
All geometry and textures are procedural. No external models, images, or CDNs are used.
