import { useEffect, useRef, useState } from 'react'
import { TERMINAL_NAME } from '../config/branding'

const AGENT_COLORS = {
  'Brief Agent':    'text-odin-cyan',
  'Concept Agent':  'text-odin-purple',
  'Prompt Agent':   'text-yellow-400',
  'Design Agent':   'text-pink-400',
  'QA Agent':       'text-orange-400',
  'Delivery Agent': 'text-odin-green',
}

export default function EventLog({ events }) {
  const bottomRef  = useRef(null)
  const [clearedAt, setClearedAt] = useState(0)

  const visible = events.slice(clearedAt)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visible.length])

  return (
    <div
      className="rounded-lg border border-odin-green/40 flex flex-col overflow-hidden"
      style={{ background: '#000', height: '16rem' }}
    >
      {/* Terminal header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-odin-green/20 bg-odin-surface/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-odin-green animate-pulse2 shrink-0" />
          <span className="text-odin-green text-xs font-bold tracking-widest">
            [ {TERMINAL_NAME} — LIVE ]
          </span>
        </div>
        <button
          onClick={() => setClearedAt(events.length)}
          className="text-[10px] font-mono tracking-widest text-odin-dim
                     border border-transparent rounded px-2 py-0.5
                     hover:text-odin-red hover:border-odin-red/40 transition-colors"
        >
          [ CLR ]
        </button>
      </div>

      {/* Log body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs flex flex-col gap-px">
        {visible.length === 0 ? (
          <div className="flex flex-col gap-1 text-odin-dim/50 select-none">
            <span>&gt; TERMINAL IDLE</span>
            <span>&gt; ALL AGENTS STANDING BY</span>
            <span className="flex items-center gap-0">
              &gt;&nbsp;AWAITING MISSION INPUT
              <span className="cursor-blink text-odin-green ml-0.5">▋</span>
            </span>
          </div>
        ) : (
          visible.map((ev, i) => {
            const isLast = i === visible.length - 1
            const ts     = new Date(ev.timestamp).toLocaleTimeString('en-US', { hour12: false })
            const short  = ev.agent?.replace(' Agent', '') || 'SYS'
            const color  = AGENT_COLORS[ev.agent] || 'text-odin-dim'

            return (
              <div key={clearedAt + i} className="flex leading-5 min-w-0">
                {/* Timestamp — fixed 68px */}
                <span className="shrink-0 w-[68px] text-odin-dim/50 select-none">
                  {ts}
                </span>
                {/* Agent name — fixed 72px */}
                <span className={`shrink-0 w-[72px] font-bold truncate ${color}`}>
                  [{short}]
                </span>
                {/* Message */}
                <span className="flex-1 min-w-0 text-gray-300 break-words">
                  {ev.message}
                  {isLast && (
                    <span className="cursor-blink text-odin-green ml-0.5">▋</span>
                  )}
                </span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
