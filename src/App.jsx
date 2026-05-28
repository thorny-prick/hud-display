import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Binary, Cpu, Crosshair, DatabaseZap } from 'lucide-react';
import { WebGLViewport } from './components/3d/WebGLViewport.jsx';
import { TopCommandBar } from './components/hud/TopCommandBar.jsx';
import { LeftInputDock } from './components/hud/LeftInputDock.jsx';
import { RightSolutionTracer } from './components/hud/RightSolutionTracer.jsx';
import { BottomSandbox } from './components/hud/BottomSandbox.jsx';
import { useGlitchLabStore } from './store/glitchLabStore.js';

const bootItems = [
  { icon: Cpu, label: 'Core math process: armed' },
  { icon: Crosshair, label: 'Viewport matrix: synced' },
  { icon: DatabaseZap, label: 'State registry: live' },
  { icon: Binary, label: 'Parser hook: mock mode' },
];

export default function App() {
  const completeBoot = useGlitchLabStore((state) => state.completeBoot);
  const isBooting = useGlitchLabStore((state) => state.isBooting);

  useEffect(() => {
    const timer = window.setTimeout(completeBoot, 1450);
    return () => window.clearTimeout(timer);
  }, [completeBoot]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] font-mono text-slate-200 selection:bg-[#ff0055]/40">
      <WebGLViewport />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(0,240,255,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(255,0,85,0.08),transparent_25%)]" />
      <div className="terminal-scanlines pointer-events-none absolute inset-0 z-30 opacity-50" />
      <div className="noise-layer pointer-events-none absolute inset-0 z-30" />

      <section className="hud-grid pointer-events-none absolute inset-0 z-40 p-3 sm:p-4 lg:p-5">
        <TopCommandBar />
        <LeftInputDock />
        <RightSolutionTracer />
        <BottomSandbox />
      </section>

      <AnimatePresence>
        {isBooting && (
          <motion.div
            className="absolute inset-0 z-50 grid place-items-center bg-[#08090c]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div
              className="panel-cut relative w-[min(640px,92vw)] border border-[#00f0ff]/40 bg-black/70 p-7 shadow-[0_0_70px_rgba(0,240,255,0.16)]"
              initial={{ y: 16, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            >
              <div className="mb-6 flex items-center gap-3 text-[#00f0ff]">
                <Activity className="h-6 w-6" />
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-slate-500">boot sequence</p>
                  <h1 className="text-2xl font-black tracking-[0.22em]">PRECALC GLITCHLAB</h1>
                </div>
              </div>

              <div className="space-y-3">
                {bootItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      className="flex items-center justify-between border border-cyan-300/10 bg-cyan-300/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-300"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.14 }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#00f0ff]" />
                        {item.label}
                      </span>
                      <span className="text-[#00f0ff]">ok</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
