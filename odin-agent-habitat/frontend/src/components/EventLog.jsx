import { useEffect, useRef } from 'react'

const AGENT_COLORS = {
  'Brief Agent':    'text-odin-cyan',
  'Concept Agent':  'text-odin-purple',
  'Prompt Agent':   'text-yellow-400',
  'Design Agent':   'text-pink-400',
  'QA Agent':       'text-orange-400',
  'Delivery Agent': 'text-odin-green',
}

export default function EventLog({ events }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <div className="odin-panel flex flex-col h-64 overflow-hidden p-0">
      <div className="px-4 py-2 border-b border-odin-border text-odin-cyan text-xs font-bold uppercase tracking-widest shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-odin-green animate-pulse2" />
        // Live Event Log
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 font-mono text-xs">
        {events.length === 0 && (
          <span className="text-odin-dim italic">Waiting for agent activity...</span>
        )}
        {events.map((ev, i) => (
          <div key={i} className="flex gap-2 leading-relaxed">
            <span className="text-odin-dim shrink-0">
              {new Date(ev.timestamp).toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className={`shrink-0 font-bold ${AGENT_COLORS[ev.agent] || 'text-white'}`}>
              [{ev.agent?.replace(' Agent', '') || 'SYS'}]
            </span>
            <span className="text-gray-300">{ev.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
