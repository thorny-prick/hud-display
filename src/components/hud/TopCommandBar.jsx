import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, RadioTower, ScanLine, ShieldCheck } from 'lucide-react';
import { HudPanel } from './HudPanel.jsx';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

const modes = ['DIAGNOSTIC', 'GRAPH', 'STUDY'];

export function TopCommandBar() {
  const telemetry = useGlitchLabStore((state) => state.telemetry);
  const tickTelemetry = useGlitchLabStore((state) => state.tickTelemetry);
  const viewportMode = useGlitchLabStore((state) => state.viewportMode);
  const setViewportMode = useGlitchLabStore((state) => state.setViewportMode);
  const appVersion = useGlitchLabStore((state) => state.appVersion);

  useEffect(() => {
    const interval = window.setInterval(tickTelemetry, 700);
    return () => window.clearInterval(interval);
  }, [tickTelemetry]);

  return (
    <HudPanel className="absolute left-3 right-3 top-3 px-4 py-3 sm:left-4 sm:right-4 lg:left-5 lg:right-5" delay={0.05}>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1.25fr] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center border border-[#00f0ff]/40 bg-cyan-300/5 text-[#00f0ff] shadow-[0_0_24px_rgba(0,240,255,0.14)]">
            <ScanLine className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.62rem] uppercase tracking-[0.36em] text-slate-500">field terminal / educational node</p>
            <h1 className="truncate text-base font-black uppercase tracking-[0.22em] text-cyan-100 sm:text-lg">
              PreCalc GlitchLab
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-[0.62rem] uppercase tracking-[0.16em] text-slate-400">
          <Metric icon={Gauge} label="FPS" value={telemetry.fps} />
          <Metric icon={RadioTower} label="CLK" value={`${telemetry.coreClock}GHz`} />
          <Metric icon={ShieldCheck} label="PKT" value={telemetry.packets} />
          <Metric icon={ScanLine} label="LOAD" value={`${telemetry.parserLoad}%`} />
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
          <span className="border border-slate-700 bg-black/30 px-2 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">
            {appVersion}
          </span>
          {modes.map((mode) => (
            <motion.button
              key={mode}
              type="button"
              onClick={() => setViewportMode(mode)}
              className={`border px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] transition ${
                viewportMode === mode
                  ? 'border-[#ff0055] bg-[#ff0055]/15 text-[#ff8aae] shadow-[0_0_18px_rgba(255,0,85,0.22)]'
                  : 'border-cyan-300/15 bg-cyan-300/5 text-slate-400 hover:border-cyan-300/40 hover:text-[#00f0ff]'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode}
            </motion.button>
          ))}
        </div>
      </div>
    </HudPanel>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="border border-cyan-300/10 bg-black/30 p-2">
      <div className="mb-1 flex items-center gap-1 text-[#00f0ff]">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-black text-cyan-50">{value}</p>
    </div>
  );
}
