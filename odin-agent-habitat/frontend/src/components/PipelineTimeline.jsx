const PIPELINE = [
  { name: 'Brief Agent',    short: 'BRIEF',   icon: '📋' },
  { name: 'Concept Agent',  short: 'CONCEPT', icon: '💡' },
  { name: 'Prompt Agent',   short: 'PROMPT',  icon: '✍️'  },
  { name: 'Design Agent',   short: 'DESIGN',  icon: '🎨' },
  { name: 'QA Agent',       short: 'QA',      icon: '🔍' },
  { name: 'Delivery Agent', short: 'DELIVER', icon: '📦' },
]

const NODE_STYLE = {
  active:  { circle: 'border-odin-green  bg-odin-green/10  text-odin-green  glow-green',  label: 'text-odin-green' },
  done:    { circle: 'border-odin-cyan   bg-odin-cyan/10   text-odin-cyan',               label: 'text-odin-cyan'  },
  pending: { circle: 'border-odin-border bg-transparent    text-odin-dim/60',             label: 'text-odin-dim'   },
}

const CONNECTOR_STYLE = {
  done:    'bg-odin-cyan',
  active:  'bg-gradient-to-r from-odin-cyan to-odin-green',
  pending: 'bg-odin-border',
}

function nodeState(agentName, agents, outputs) {
  const agent = agents.find(a => a.name === agentName)
  if (agent?.status === 'working') return 'active'
  if (outputs.some(o => o.agent_name === agentName)) return 'done'
  return 'pending'
}

function connectorState(leftIdx, agents, outputs) {
  const left  = nodeState(PIPELINE[leftIdx].name,     agents, outputs)
  const right = nodeState(PIPELINE[leftIdx + 1].name, agents, outputs)
  if (left === 'done'   && right === 'done')   return 'done'
  if (left === 'done'   && right === 'active') return 'active'
  if (left === 'active' && right === 'pending') return 'active'
  return 'pending'
}

export default function PipelineTimeline({ agents, outputs }) {
  const anyActive = agents.some(a => a.status === 'working')
  const allDone   = outputs.length === PIPELINE.length

  return (
    <div className="odin-panel">
      <div className="flex items-center justify-between mb-4">
        <span className="text-odin-cyan text-xs font-bold uppercase tracking-widest">
          // Pipeline
        </span>
        <span className="text-xs text-odin-dim">
          {allDone
            ? '[ COMPLETE — AWAITING REVIEW ]'
            : anyActive
            ? '[ RUNNING ]'
            : '[ STANDBY ]'}
        </span>
      </div>

      <div className="flex items-center w-full overflow-x-auto pb-1">
        {PIPELINE.map((step, i) => {
          const state = nodeState(step.name, agents, outputs)
          const st    = NODE_STYLE[state]
          const isLast = i === PIPELINE.length - 1

          return (
            <div key={step.name} className="flex items-center" style={{ flex: isLast ? '0 0 auto' : '1 1 0%' }}>
              {/* Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  {state === 'active' && <div className="pipeline-ring" />}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg
                                transition-all duration-500 ${st.circle}`}
                  >
                    {step.icon}
                  </div>
                </div>
                <span className={`text-[9px] font-bold tracking-widest mt-1.5 transition-colors duration-500 ${st.label}`}>
                  {step.short}
                </span>
              </div>

              {/* Connector — not after last node */}
              {!isLast && (
                <div
                  className={`h-px flex-1 mx-1 transition-all duration-700 ${CONNECTOR_STYLE[connectorState(i, agents, outputs)]}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
