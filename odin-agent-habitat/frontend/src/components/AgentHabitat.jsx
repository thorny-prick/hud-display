const PIPELINE = [
  { name: 'Brief Agent',    short: 'BRIEF',   icon: '📋', seq: '01' },
  { name: 'Concept Agent',  short: 'CONCEPT', icon: '💡', seq: '02' },
  { name: 'Prompt Agent',   short: 'PROMPT',  icon: '✍️',  seq: '03' },
  { name: 'Design Agent',   short: 'DESIGN',  icon: '🎨', seq: '04' },
  { name: 'QA Agent',       short: 'QA',      icon: '🔍', seq: '05' },
  { name: 'Delivery Agent', short: 'DELIVER', icon: '📦', seq: '06' },
]

const ROW1 = PIPELINE.slice(0, 3)
const ROW2 = PIPELINE.slice(3, 6)

const NODE_CFG = {
  active: {
    border:   'border-odin-green',
    glow:     'glow-green',
    bg:       'bg-odin-green/5',
    iconCls:  'opacity-100',
    labelCls: 'text-odin-green',
    seqCls:   'text-odin-green/50',
    nameCls:  'text-white',
    showRing: true,
    showBar:  true,
    statusTxt: '● WORKING',
  },
  done: {
    border:   'border-odin-cyan',
    glow:     '',
    bg:       'bg-odin-cyan/5',
    iconCls:  'opacity-100',
    labelCls: 'text-odin-cyan',
    seqCls:   'text-odin-cyan/50',
    nameCls:  'text-white',
    showRing: false,
    showBar:  false,
    statusTxt: '✓ DONE',
  },
  pending: {
    border:   'border-odin-border',
    glow:     '',
    bg:       '',
    iconCls:  'opacity-20 grayscale',
    labelCls: 'text-odin-dim/40',
    seqCls:   'text-odin-dim/25',
    nameCls:  'text-odin-dim/40',
    showRing: false,
    showBar:  false,
    statusTxt: '○ IDLE',
  },
}

const CONN_COLOR = {
  done:    { line: 'bg-odin-cyan',   arrow: 'text-odin-cyan'  },
  active:  { line: 'bg-odin-green',  arrow: 'text-odin-green' },
  pending: { line: 'bg-odin-border', arrow: 'text-odin-border'},
}

function nodeState(agentName, agents, outputs) {
  const a = agents.find(a => a.name === agentName)
  if (a?.status === 'working') return 'active'
  if (outputs.some(o => o.agent_name === agentName)) return 'done'
  return 'pending'
}

function connState(leftName, rightName, agents, outputs) {
  const l = nodeState(leftName, agents, outputs)
  const r = nodeState(rightName, agents, outputs)
  if (l === 'done' && (r === 'done' || r === 'active')) return l === 'done' && r === 'done' ? 'done' : 'active'
  if (l === 'active') return 'active'
  return 'pending'
}

function HabitatNode({ step, agents, outputs }) {
  const state = nodeState(step.name, agents, outputs)
  const cfg   = NODE_CFG[state]

  return (
    <div
      className={`
        relative flex flex-col items-center gap-1 p-3 rounded-lg border-2
        bg-odin-surface transition-all duration-500 flex-1 min-w-0 overflow-hidden
        ${cfg.border} ${cfg.glow} ${cfg.bg}
      `}
    >
      {/* Pulse ring for active state */}
      {cfg.showRing && (
        <div className="absolute inset-0 rounded-lg border-2 border-odin-green animate-ring-pulse pointer-events-none" />
      )}

      {/* Sequence badge */}
      <span className={`absolute top-1.5 left-2 text-[8px] font-mono font-bold ${cfg.seqCls}`}>
        {step.seq}
      </span>

      {/* Icon */}
      <span className={`text-2xl mt-3 transition-all duration-500 ${cfg.iconCls}`}>
        {step.icon}
      </span>

      {/* Short name */}
      <span className={`text-[9px] font-bold tracking-widest transition-colors duration-500 ${cfg.nameCls}`}>
        {step.short}
      </span>

      {/* Status label */}
      <span className={`text-[8px] font-mono transition-colors duration-500 ${cfg.labelCls}`}>
        {cfg.statusTxt}
      </span>

      {/* Scan bar while working */}
      {cfg.showBar && <div className="card-scan-bar" />}
    </div>
  )
}

function HConnector({ leftName, rightName, agents, outputs }) {
  const state = connState(leftName, rightName, agents, outputs)
  const c     = CONN_COLOR[state]
  return (
    <div className="flex items-center shrink-0 w-7 sm:w-10">
      <div className={`flex-1 h-px transition-colors duration-500 ${c.line}`} />
      <span className={`text-[8px] transition-colors duration-500 ${c.arrow}`}>▶</span>
    </div>
  )
}

function BridgeSVG({ agents, outputs }) {
  // Bridge connector goes from Prompt (right col, row 1) down-left to Design (left col, row 2)
  // viewBox 0-100 maps ~85 to Prompt center, ~15 to Design center (stable across widths)
  const promptState = nodeState('Prompt Agent', agents, outputs)
  const designState = nodeState('Design Agent', agents, outputs)
  const active = promptState === 'done' || promptState === 'active'
  const done   = promptState === 'done' && designState !== 'pending'
  const stroke = done ? '#00d4ff' : active ? '#00ff88' : '#2a2a4a'

  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="hidden sm:block shrink-0"
      aria-hidden="true"
    >
      <path
        d="M 85 0 L 85 60 L 15 60 L 15 100"
        stroke={stroke}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: 'stroke 0.5s ease' }}
      />
    </svg>
  )
}

export default function AgentHabitat({ agents, outputs }) {
  const anyActive = agents.some(a => a.status === 'working')
  const doneCount = PIPELINE.filter(s => outputs.some(o => o.agent_name === s.name)).length

  return (
    <div className="odin-panel flex flex-col gap-3">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <span className="text-odin-cyan text-xs font-bold uppercase tracking-widest">
          // Agent Habitat Map
        </span>
        <span className="text-[10px] font-mono text-odin-dim">
          {anyActive
            ? '[ PIPELINE ACTIVE ]'
            : doneCount === 6
            ? '[ ALL STATIONS DONE ]'
            : '[ ALL STATIONS IDLE ]'}
        </span>
      </div>

      {/* ── Desktop layout: 3 + bridge + 3 ─────────────────────────────── */}
      <div className="hidden sm:flex flex-col gap-0">
        {/* Row 1: Brief → Concept → Prompt */}
        <div className="flex items-stretch gap-0">
          {ROW1.map((step, i) => (
            <div key={step.name} className="flex items-stretch flex-1 min-w-0">
              <HabitatNode step={step} agents={agents} outputs={outputs} />
              {i < ROW1.length - 1 && (
                <HConnector
                  leftName={PIPELINE[i].name}
                  rightName={PIPELINE[i + 1].name}
                  agents={agents}
                  outputs={outputs}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bridge: Prompt → Design */}
        <BridgeSVG agents={agents} outputs={outputs} />

        {/* Row 2: Design → QA → Delivery */}
        <div className="flex items-stretch gap-0">
          {ROW2.map((step, i) => (
            <div key={step.name} className="flex items-stretch flex-1 min-w-0">
              <HabitatNode step={step} agents={agents} outputs={outputs} />
              {i < ROW2.length - 1 && (
                <HConnector
                  leftName={PIPELINE[i + 3].name}
                  rightName={PIPELINE[i + 4].name}
                  agents={agents}
                  outputs={outputs}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile layout: 3×2 compact grid ─────────────────────────────── */}
      <div className="sm:hidden flex flex-col gap-2">
        {/* Row 1 */}
        <div className="flex gap-2">
          {ROW1.map(step => (
            <HabitatNode key={step.name} step={step} agents={agents} outputs={outputs} />
          ))}
        </div>
        {/* Mobile bridge indicator */}
        <div className="flex justify-center text-[9px] font-mono text-odin-dim/40 select-none">
          ↓ pipeline continues
        </div>
        {/* Row 2 */}
        <div className="flex gap-2">
          {ROW2.map(step => (
            <HabitatNode key={step.name} step={step} agents={agents} outputs={outputs} />
          ))}
        </div>
      </div>
    </div>
  )
}
