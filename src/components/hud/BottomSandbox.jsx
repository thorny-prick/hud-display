import { BookOpen, FilePenLine, TerminalSquare } from 'lucide-react';
import { HudPanel } from './HudPanel.jsx';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

export function BottomSandbox() {
  const formulas = useGlitchLabStore((state) => state.formulas);
  const notes = useGlitchLabStore((state) => state.terminalNotes);
  const setNotes = useGlitchLabStore((state) => state.setTerminalNotes);
  const activeStepId = useGlitchLabStore((state) => state.activeStepId);

  return (
    <HudPanel className="dock-bottom absolute bottom-3 left-3 right-3 p-4 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-5 lg:left-5 lg:right-5" delay={0.24}>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
        <section>
          <Header icon={BookOpen} eyebrow="reference matrix" title="Relevant Formulas" />
          <div className="grid gap-2 sm:grid-cols-2">
            {formulas.map((formula) => (
              <article key={formula.id} className="border border-cyan-300/10 bg-black/30 p-3">
                <h3 className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-100">{formula.label}</h3>
                <p className="mt-2 text-sm text-[#00f0ff]">{formula.body}</p>
                <p className="mt-2 text-[0.68rem] leading-4 text-slate-500">{formula.use}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <Header icon={TerminalSquare} eyebrow="terminal log" title="Operator Notes" />
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            spellCheck="false"
            className="terminal-input h-[9.7rem] w-full resize-none border border-cyan-300/15 bg-black/40 p-3 text-xs leading-5 text-slate-300 outline-none transition focus:border-[#00f0ff]/70"
          />
        </section>

        <section>
          <Header icon={FilePenLine} eyebrow="live binding" title="State Probe" />
          <div className="h-[9.7rem] overflow-hidden border border-cyan-300/10 bg-black/35 p-3 text-xs leading-6 text-slate-400">
            <ProbeLine label="active_step" value={activeStepId} accent />
            <ProbeLine label="graph_source" value="zustand.rawExpression" />
            <ProbeLine label="render_target" value="r3f.ParametricGraph" />
            <ProbeLine label="parser_mode" value="mock-safe-no-eval" />
            <ProbeLine label="math_hook" value="/utils/expressionSampler.js" />
            <div className="mt-3 border-t border-cyan-300/10 pt-3 text-[0.68rem] text-slate-600">
              DOM controls and the WebGL scene subscribe to the same store, so every click updates both the HUD pipeline and the central matrix.
            </div>
          </div>
        </section>
      </div>
    </HudPanel>
  );
}

function Header({ icon: Icon, eyebrow, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#00f0ff]" />
      <div>
        <p className="text-[0.58rem] uppercase tracking-[0.28em] text-slate-600">{eyebrow}</p>
        <h2 className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">{title}</h2>
      </div>
    </div>
  );
}

function ProbeLine({ label, value, accent = false }) {
  return (
    <div className="flex justify-between gap-3 border-b border-cyan-300/5 py-1">
      <span className="uppercase tracking-[0.2em] text-slate-600">{label}</span>
      <span className={accent ? 'text-[#ff8aae]' : 'text-[#00f0ff]'}>{value}</span>
    </div>
  );
}
