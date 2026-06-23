const STATUS_CONFIG = {
  idle: {
    dot:       'bg-odin-dim',
    label:     'text-odin-dim',
    text:      'IDLE',
    border:    'border-odin-border',
    glow:      '',
    nameColor: 'text-white/50',
    iconClass: 'opacity-30 grayscale',
    cardOpacity: 'opacity-60',
    showBar:   false,
    showTask:  false,
  },
  working: {
    dot:       'bg-odin-green animate-pulse2',
    label:     'text-odin-green',
    text:      'WORKING',
    border:    'border-odin-green',
    glow:      'glow-green',
    nameColor: 'text-white animate-flicker',
    iconClass: 'opacity-100',
    cardOpacity: 'opacity-100',
    showBar:   true,
    showTask:  true,
  },
  error: {
    dot:       'bg-odin-red animate-pulse2',
    label:     'text-odin-red',
    text:      'ERROR',
    border:    'border-odin-red',
    glow:      'glow-red',
    nameColor: 'text-odin-red',
    iconClass: 'opacity-80',
    cardOpacity: 'opacity-100',
    showBar:   false,
    showTask:  false,
  },
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
  const cfg  = STATUS_CONFIG[agent.status] || STATUS_CONFIG.idle
  const icon = AGENT_ICONS[agent.name] || '🤖'

  return (
    <div
      className={`
        relative flex flex-col gap-2 rounded-lg border-2 p-4 overflow-hidden
        bg-odin-surface transition-all duration-500
        ${cfg.border} ${cfg.glow} ${cfg.cardOpacity}
      `}
    >
      {/* Icon + status indicator row */}
      <div className="flex items-center justify-between">
        <span className={`text-xl transition-all duration-500 ${cfg.iconClass}`}>
          {icon}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
          <span className={`text-[10px] font-mono font-bold tracking-widest ${cfg.label}`}>
            {cfg.text}
          </span>
        </div>
      </div>

      {/* Agent name */}
      <div className={`text-sm font-bold leading-tight transition-colors duration-300 ${cfg.nameColor}`}>
        {agent.name}
      </div>

      {/* Role description */}
      <div className="text-[10px] text-odin-dim leading-relaxed">
        {agent.role}
      </div>

      {/* Active task indicator */}
      {cfg.showTask && agent.current_task_id && (
        <div className="text-[10px] text-odin-cyan font-bold tracking-wider mt-0.5">
          ▶ TASK #{agent.current_task_id}
        </div>
      )}

      {/* Scan bar — only visible while working */}
      {cfg.showBar && <div className="card-scan-bar" />}
    </div>
  )
}
