import { useState } from 'react'

const AGENT_COLORS = {
  'Brief Agent':    'border-odin-cyan text-odin-cyan',
  'Concept Agent':  'border-odin-purple text-odin-purple',
  'Prompt Agent':   'border-yellow-400 text-yellow-400',
  'Design Agent':   'border-pink-400 text-pink-400',
  'QA Agent':       'border-orange-400 text-orange-400',
  'Delivery Agent': 'border-odin-green text-odin-green',
}

export default function OutputPanel({ outputs }) {
  const [active, setActive] = useState(null)

  if (outputs.length === 0) {
    return (
      <div className="odin-panel text-center py-8">
        <div className="text-odin-dim text-sm">No outputs yet.</div>
        <div className="text-odin-dim/50 text-xs mt-1">Select a task with results to view agent outputs.</div>
      </div>
    )
  }

  const current = active !== null ? outputs[active] : outputs[outputs.length - 1]
  const currentIdx = active !== null ? active : outputs.length - 1

  return (
    <div className="odin-panel flex flex-col gap-3 p-0 overflow-hidden">
      <div className="px-4 py-2 border-b border-odin-border text-odin-cyan text-xs font-bold uppercase tracking-widest">
        // Agent Outputs
      </div>

      <div className="flex gap-2 px-4 flex-wrap">
        {outputs.map((out, i) => {
          const col = AGENT_COLORS[out.agent_name] || 'border-odin-dim text-odin-dim'
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`text-xs px-2 py-1 rounded border font-mono transition-all
                ${i === currentIdx ? col + ' bg-white/5' : 'border-odin-border text-odin-dim hover:border-odin-dim'}`}
            >
              {out.agent_name.replace(' Agent', '')}
            </button>
          )
        })}
      </div>

      {current && (
        <div className="px-4 pb-4">
          <div className={`text-xs font-bold mb-2 ${(AGENT_COLORS[current.agent_name] || 'text-odin-dim').split(' ')[1]}`}>
            {current.agent_name} — {current.output_type}
          </div>
          <pre className="bg-odin-bg rounded p-3 text-xs text-gray-300 overflow-auto max-h-72 whitespace-pre-wrap leading-relaxed">
            {current.content}
          </pre>
        </div>
      )}
    </div>
  )
}
