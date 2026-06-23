import { useState } from 'react'

const AGENT_CONFIG = {
  'Brief Agent':    { color: 'text-odin-cyan',   leftBorder: 'border-l-odin-cyan',   headerBg: 'bg-odin-cyan/5'   },
  'Concept Agent':  { color: 'text-odin-purple',  leftBorder: 'border-l-odin-purple', headerBg: 'bg-odin-purple/5' },
  'Prompt Agent':   { color: 'text-yellow-400',   leftBorder: 'border-l-yellow-400',  headerBg: 'bg-yellow-400/5'  },
  'Design Agent':   { color: 'text-pink-400',     leftBorder: 'border-l-pink-400',    headerBg: 'bg-pink-400/5'    },
  'QA Agent':       { color: 'text-orange-400',   leftBorder: 'border-l-orange-400',  headerBg: 'bg-orange-400/5'  },
  'Delivery Agent': { color: 'text-odin-green',   leftBorder: 'border-l-odin-green',  headerBg: 'bg-odin-green/5'  },
}

const FALLBACK_CFG = { color: 'text-odin-dim', leftBorder: 'border-l-odin-border', headerBg: '' }

function CopyButton({ content }) {
  const [state, setState] = useState('idle')

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setState('copied')
      setTimeout(() => setState('idle'), 1500)
    }).catch(() => setState('idle'))
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all shrink-0
        ${state === 'copied'
          ? 'border-odin-green text-odin-green'
          : 'border-odin-border text-odin-dim hover:border-odin-cyan hover:text-odin-cyan'
        }`}
    >
      {state === 'copied' ? '[ COPIED ]' : '[ COPY ]'}
    </button>
  )
}

function OutputCard({ output, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const cfg = AGENT_CONFIG[output.agent_name] || FALLBACK_CFG

  const ts = output.created_at
    ? new Date(output.created_at).toLocaleTimeString('en-US', { hour12: false })
    : null

  return (
    <div
      className={`rounded-lg border border-odin-border border-l-[3px] bg-odin-bg
                  overflow-hidden transition-all duration-300 ${cfg.leftBorder}`}
    >
      {/* Card header */}
      <div className={`flex items-center justify-between gap-2 px-3 py-2 ${cfg.headerBg}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`text-xs font-bold shrink-0 ${cfg.color}`}>
            {output.agent_name}
          </span>
          <span className="text-[10px] px-1.5 py-px rounded border border-odin-border text-odin-dim font-mono uppercase tracking-wider shrink-0">
            {output.output_type}
          </span>
          {ts && (
            <span className="text-[10px] text-odin-dim/40 font-mono hidden sm:block shrink-0">
              {ts}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <CopyButton content={output.content} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[10px] text-odin-dim hover:text-white transition-colors font-mono w-5 text-center"
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      {expanded && (
        <pre className="px-3 py-3 text-xs text-gray-300 overflow-auto max-h-56
                        whitespace-pre-wrap leading-relaxed font-mono
                        border-t border-odin-border bg-odin-bg">
          {output.content}
        </pre>
      )}
    </div>
  )
}

export default function OutputPanel({ outputs }) {
  if (outputs.length === 0) {
    return (
      <div className="odin-panel py-8">
        <div className="flex flex-col items-center gap-1 font-mono text-xs text-odin-dim/50 select-none">
          <span>&gt; SYSTEM READY</span>
          <span className="flex items-center gap-0">
            &gt;&nbsp;AWAITING AGENT OUTPUT
            <span className="cursor-blink text-odin-green ml-0.5">▋</span>
          </span>
          <span className="text-[10px] text-odin-dim/30 mt-2 text-center">
            Select a task from the queue — or hit [ RUN DEMO ] to watch the pipeline live.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="odin-panel flex flex-col gap-0 p-0 overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-2 border-b border-odin-border flex items-center justify-between shrink-0">
        <span className="text-odin-cyan text-xs font-bold uppercase tracking-widest">
          // Output Gallery
        </span>
        <span className="text-[10px] text-odin-dim font-mono">
          {outputs.length}&nbsp;/&nbsp;6 agents
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-4 overflow-y-auto max-h-[32rem]">
        {outputs.map((out, i) => (
          <OutputCard
            key={`${out.agent_name}-${i}`}
            output={out}
            defaultExpanded={i === outputs.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
