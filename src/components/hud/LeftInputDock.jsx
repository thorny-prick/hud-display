import { motion } from 'framer-motion';
import { Eye, EyeOff, Send, SlidersHorizontal } from 'lucide-react';
import { HudPanel, SectionLabel } from './HudPanel.jsx';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

const toggles = [
  ['grid', 'Grid Mesh'],
  ['packets', 'Data Packets'],
  ['vectorTracer', 'Vector Tracer'],
  ['functionLine', 'Function Line'],
];

export function LeftInputDock() {
  const rawExpression = useGlitchLabStore((state) => state.rawExpression);
  const setRawExpression = useGlitchLabStore((state) => state.setRawExpression);
  const visibility = useGlitchLabStore((state) => state.visibility);
  const toggleVisibility = useGlitchLabStore((state) => state.toggleVisibility);

  return (
    <HudPanel className="dock-left absolute left-3 top-[6.1rem] w-[min(25rem,calc(100vw-1.5rem))] p-4 sm:left-4 lg:left-5" delay={0.12}>
      <SectionLabel eyebrow="left dock / input" title="Expression Registry" />

      <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">Raw math string</label>
      <div className="relative">
        <textarea
          value={rawExpression}
          onChange={(event) => setRawExpression(event.target.value)}
          spellCheck="false"
          rows={4}
          className="terminal-input min-h-28 w-full resize-none border border-cyan-300/20 bg-black/45 p-3 pr-10 text-sm leading-6 text-cyan-50 outline-none transition placeholder:text-slate-700 focus:border-[#00f0ff]/70 focus:shadow-[0_0_22px_rgba(0,240,255,0.12)]"
          placeholder="Try: y = x^2 - 4, y = cos(x), y = abs(x)"
        />
        <Send className="absolute right-3 top-3 h-4 w-4 text-[#00f0ff]" />
      </div>

      <p className="mt-3 border-l border-[#ff0055] bg-[#ff0055]/5 px-3 py-2 text-xs leading-5 text-slate-400">
        Phase 1 uses a safe mock sampler. Later, a Math.js adapter can publish parsed AST data into this same store without changing the HUD or WebGL scene contract.
      </p>

      <div className="mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">
        <SlidersHorizontal className="h-4 w-4 text-[#00f0ff]" />
        Visibility Flags
      </div>

      <div className="mt-3 grid gap-2">
        {toggles.map(([key, label]) => {
          const active = visibility[key];
          const Icon = active ? Eye : EyeOff;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => toggleVisibility(key)}
              className={`flex items-center justify-between border px-3 py-2 text-left text-xs uppercase tracking-[0.18em] transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-50'
                  : 'border-slate-800 bg-black/20 text-slate-600'
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>{label}</span>
              <Icon className="h-4 w-4" />
            </motion.button>
          );
        })}
      </div>
    </HudPanel>
  );
}
