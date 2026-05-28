# PreCalc GlitchLab Phase 1

A production-oriented visual and interaction shell for a WebGL-infused precalculus workspace. This phase focuses on architecture, layout, shared state synchronization, and a safe mock graph sampler.

## Stack

- React 18 + Vite
- Tailwind CSS through the Vite plugin
- Framer Motion for HUD transitions and micro-interactions
- Zustand for shared DOM/WebGL state
- React Three Fiber + Drei for the central coordinate viewport

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Current Phase 1 behavior

- Top command bar with simulated telemetry and viewport modes.
- Left dock expression registry with visibility toggles.
- Right dock clickable diagnostic pipeline.
- Bottom sandbox with formula reference cards, editable notes, and live state probe.
- Center WebGL scene with coordinate axes, double-layer wire floor, data packet particles, vector tracer, and a responsive graph line.

## Where real algebra plugs in later

The only intentionally fake piece is `src/utils/expressionSampler.js`. It does not use `eval()` and only classifies a few expression patterns to keep Phase 1 safe.

For Phase 2:

1. Add Math.js or a backend Python/SymPy service.
2. Convert user input into a typed AST.
3. Transform that AST into sanitized render instructions: points, intercept markers, asymptotes, holes, extrema, and domain boundaries.
4. Store those instructions in `src/store/glitchLabStore.js`.
5. Keep React Three Fiber components as pure renderers that subscribe to the store.

That separation is deliberate: the WebGL scene should never parse raw user text directly.
