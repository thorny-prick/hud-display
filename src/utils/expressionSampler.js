import * as THREE from 'three';

/**
 * Mock expression sampler for Phase 1.
 *
 * Why no eval()?
 * User-provided math strings should never be executed as JavaScript. This file
 * uses a tiny deterministic classifier so the WebGL shell can demonstrate live
 * UI/state synchronization without creating a security problem.
 *
 * Production hook plan:
 * 1. Add Math.js or a backend parser endpoint that returns a typed AST.
 * 2. Normalize the AST into graph instructions: sampled points, intercepts,
 *    asymptotes, extrema, domain holes, and error boundaries.
 * 3. Store those graph instructions in Zustand.
 * 4. Keep R3F components dumb: they should render sanitized geometry, not parse.
 */
export function sampleExpression(expression, activeStepId) {
  const normalized = expression.toLowerCase().replace(/\s+/g, '');
  const stepLift = getStepLift(activeStepId);
  const points = [];

  for (let i = 0; i <= 220; i += 1) {
    const x = -8 + (16 * i) / 220;
    const y = sampleY(normalized, x) + stepLift;
    points.push(new THREE.Vector3(x, y, 0));
  }

  return points;
}

function sampleY(expression, x) {
  if (expression.includes('tan')) {
    return clamp(Math.tan(x * 0.65), -5, 5) * 0.55;
  }

  if (expression.includes('cos')) {
    return Math.cos(x) + x * 0.14;
  }

  if (expression.includes('sin')) {
    return Math.sin(x) + x * 0.25;
  }

  if (expression.includes('x^2') || expression.includes('x**2') || expression.includes('quadratic')) {
    return x * x * 0.11 - 2.15;
  }

  if (expression.includes('sqrt')) {
    return x < -4 ? Number.NaN : Math.sqrt(x + 4) - 1.5;
  }

  if (expression.includes('abs')) {
    return Math.abs(x) * 0.55 - 2.2;
  }

  return x * 0.45;
}

function getStepLift(activeStepId) {
  const lifts = {
    ingest: 0,
    normalize: 0.18,
    classify: 0.34,
    sample: 0.5,
    render: 0.64,
  };

  return lifts[activeStepId] ?? 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
