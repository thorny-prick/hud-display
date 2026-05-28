import { motion } from 'framer-motion';
import { GitBranch, RadioReceiver } from 'lucide-react';
import { HudPanel, SectionLabel } from './HudPanel.jsx';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

export function RightSolutionTracer() {
  const steps = useGlitchLabStore((state) => state.solutionSteps);
  const activeStepId = useGlitchLabStore((state) => state.activeStepId);
  const setActiveStep = useGlitchLabStore((state) => state.setActiveStep);

  return (
    <HudPanel className="dock-right absolute right-3 top-[6.1rem] w-[min(26rem,calc(100vw-1.5rem))] p-4 sm:right-4 lg:right-5" delay={0.18}>
      <SectionLabel eyebrow="right dock / tracer" title="Solution Pipeline" />

      <div className="space-y-3">
        {steps.map((step, index) => {
          const active = step.id === activeStepId;
          return (
            <motion.button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`group relative w-full border p-3 text-left transition ${
                active
                  ? 'border-[#ff0055]/70 bg-[#ff0055]/12 shadow-[0_0_28px_rgba(255,0,85,0.16)]'
                  : 'border-cyan-300/15 bg-black/25 hover:border-cyan-300/40 hover:bg-cyan-300/8'
              }`}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-9 w-9 shrink-0 place-items-center border ${active ? 'border-[#ff0055] text-[#ff8aae]' : 'border-cyan-300/30 text-[#00f0ff]'}`}>
                  {active ? <RadioReceiver className="h-4 w-4" /> : <GitBranch className="h-4 w-4" />}
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">{step.code}</span>
                    <span className={`text-[0.58rem] uppercase tracking-[0.24em] ${active ? 'text-[#ff8aae]' : 'text-[#00f0ff]'}`}>
                      node {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-50">{step.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </HudPanel>
  );
}
