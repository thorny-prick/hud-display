const STATUS_CONFIG = {
  pending:      { cls: 'bg-odin-dim/20 text-odin-dim border-odin-dim',           label: 'PENDING' },
  running:      { cls: 'bg-odin-green/10 text-odin-green border-odin-green',      label: 'RUNNING' },
  needs_review: { cls: 'bg-odin-yellow/10 text-odin-yellow border-odin-yellow',   label: 'REVIEW' },
  complete:     { cls: 'bg-odin-cyan/10 text-odin-cyan border-odin-cyan',          label: 'COMPLETE' },
  failed:       { cls: 'bg-odin-red/10 text-odin-red border-odin-red',             label: 'FAILED' },
}

export default function TaskQueue({ tasks, selectedTaskId, onSelect }) {
  if (tasks.length === 0) {
    return (
      <div className="odin-panel text-center py-8">
        <div className="text-odin-dim text-sm">No tasks yet.</div>
        <div className="text-odin-dim/50 text-xs mt-1">Create one to launch the pipeline.</div>
      </div>
    )
  }

  return (
    <div className="odin-panel flex flex-col gap-0 overflow-hidden p-0">
      <div className="px-4 py-2 border-b border-odin-border text-odin-cyan text-xs font-bold uppercase tracking-widest">
        // Task Queue
      </div>
      <div className="divide-y divide-odin-border">
        {tasks.map((task) => {
          const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
          const isSelected = task.id === selectedTaskId
          return (
            <button
              key={task.id}
              onClick={() => onSelect(task.id)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors
                ${isSelected ? 'bg-odin-green/5 border-l-2 border-l-odin-green' : 'hover:bg-odin-surface/50'}`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-white truncate">{task.title}</span>
                <span className="text-xs text-odin-dim truncate">{task.service_type}</span>
              </div>
              <span className={`status-badge border ${sc.cls} shrink-0`}>{sc.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
