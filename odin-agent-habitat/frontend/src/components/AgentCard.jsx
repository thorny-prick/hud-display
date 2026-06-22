const STATUS_STYLES = {
  idle:    { dot: 'bg-odin-dim',    label: 'text-odin-dim',    text: 'IDLE' },
  working: { dot: 'bg-odin-green animate-pulse2', label: 'text-odin-green', text: 'WORKING' },
  error:   { dot: 'bg-odin-red',    label: 'text-odin-red',    text: 'ERROR' },
}

const AGENT_ICONS = {
  'Brief Agent':    '📋',
  'Concept Agent':  '💡',
  'Prompt Agent':   '✍️',
  'Design Agent':   '🎨',
  'QA Agent':       '🔍',
  'Delivery Agent': '📦',
}

export default function AgentCard({ agent }) {
  const st = STATUS_STYLES[agent.status] || STATUS_STYLES.idle
  const icon = AGENT_ICONS[agent.name] || '🤖'

  return (
    <div className={`odin-panel flex flex-col gap-2 transition-all duration-300 ${agent.status === 'working' ? 'border-odin-green border-glow-green' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
          <span className={`text-xs font-mono font-bold ${st.label}`}>{st.text}</span>
        </div>
      </div>
      <div className="text-sm font-bold text-white">{agent.name}</div>
      <div className="text-xs text-odin-dim leading-relaxed">{agent.role}</div>
      {agent.current_task_id && (
        <div className="text-xs text-odin-cyan mt-1">Task #{agent.current_task_id}</div>
      )}
    </div>
  )
}
