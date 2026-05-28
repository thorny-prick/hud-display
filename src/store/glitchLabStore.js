import { create } from 'zustand';

const BASE_STEPS = [
  {
    id: 'ingest',
    code: 'P-01',
    title: 'Input Ingest',
    description: 'Capture the raw math string and place it into the shared registry.',
    vector: [0.15, 0.35, 1.0],
  },
  {
    id: 'normalize',
    code: 'P-02',
    title: 'Symbol Normalize',
    description: 'Transform user-friendly notation into an internal expression graph.',
    vector: [0.65, 0.7, 1.35],
  },
  {
    id: 'classify',
    code: 'P-03',
    title: 'Function Classify',
    description: 'Detect polynomial, trigonometric, rational, or exponential behavior.',
    vector: [1.05, 0.95, 1.7],
  },
  {
    id: 'sample',
    code: 'P-04',
    title: 'Coordinate Sample',
    description: 'Generate stable graph points for the central WebGL line renderer.',
    vector: [1.35, 1.1, 2.1],
  },
  {
    id: 'render',
    code: 'P-05',
    title: 'Viewport Commit',
    description: 'Publish the updated geometry and active diagnostic step to the scene.',
    vector: [1.6, 1.35, 2.6],
  },
];

const FORMULAS = [
  {
    id: 'quadratic',
    label: 'Quadratic Formula',
    body: 'x = (-b ± √(b² - 4ac)) / 2a',
    use: 'Solving ax² + bx + c = 0',
  },
  {
    id: 'vertex',
    label: 'Vertex Form',
    body: 'y = a(x - h)² + k',
    use: 'Inspecting parabola shift and stretch',
  },
  {
    id: 'unit-circle',
    label: 'Unit Circle',
    body: 'x² + y² = 1',
    use: 'Trig coordinates and radians',
  },
  {
    id: 'slope',
    label: 'Slope',
    body: 'm = (y₂ - y₁) / (x₂ - x₁)',
    use: 'Linear rate of change',
  },
];

export const useGlitchLabStore = create((set, get) => ({
  appVersion: 'GLITCHLAB-P1.0.0',
  isBooting: true,
  viewportMode: 'DIAGNOSTIC',
  rawExpression: 'y = sin(x) + 0.25x',
  activeStepId: 'ingest',
  terminalNotes:
    'Operator note: Phase 1 visual shell. Replace mock parser with Math.js/SymPy-backed service when algebra module is ready.',
  visibility: {
    grid: true,
    packets: true,
    vectorTracer: true,
    functionLine: true,
  },
  telemetry: {
    fps: 60,
    coreClock: 3.7,
    packets: 128,
    parserLoad: 12,
  },
  formulas: FORMULAS,
  solutionSteps: BASE_STEPS,

  completeBoot: () => set({ isBooting: false }),
  setViewportMode: (viewportMode) => set({ viewportMode }),
  setRawExpression: (rawExpression) => {
    // Phase 1 keeps this intentionally lightweight. A real parser adapter can
    // live in /utils/expressionAdapter.js and write a typed AST into this store.
    // The 3D scene should never parse user text directly. It should subscribe to
    // sanitized geometry-ready state such as points, asymptotes, intercepts, and
    // discontinuity markers.
    set({ rawExpression, activeStepId: 'ingest' });
  },
  setActiveStep: (activeStepId) => set({ activeStepId }),
  setTerminalNotes: (terminalNotes) => set({ terminalNotes }),
  toggleVisibility: (key) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        [key]: !state.visibility[key],
      },
    })),
  tickTelemetry: () => {
    const previous = get().telemetry;
    const wobble = Math.sin(Date.now() / 850);
    set({
      telemetry: {
        fps: Math.max(54, Math.min(61, Math.round(58 + wobble * 3))),
        coreClock: Number((3.68 + wobble * 0.09).toFixed(2)),
        packets: Math.round(124 + Math.abs(wobble) * 20),
        parserLoad: Math.max(8, Math.round(previous.parserLoad + wobble * 2)),
      },
    });
  },
}));
