import { useState } from 'react'
import { updateTaskStatus } from '../api/client'

export default function ApprovalButtons({ task, onStatusChange }) {
  const [loading, setLoading] = useState(null)

  if (!task || task.status !== 'needs_review') return null

  const act = (status, label) => async () => {
    setLoading(label)
    try {
      await updateTaskStatus(task.id, status)
      onStatusChange(task.id, status)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="odin-panel flex flex-col gap-3">
      <div className="text-odin-yellow text-xs font-bold uppercase tracking-widest">
        // Awaiting Review — Task #{task.id}: {task.title}
      </div>
      <p className="text-xs text-odin-dim">
        All agents have completed. Review the outputs above and make a decision.
      </p>
      <div className="flex gap-3 flex-wrap">
        <button
          className="odin-btn-green flex-1"
          onClick={act('complete', 'approve')}
          disabled={!!loading}
        >
          {loading === 'approve' ? '...' : '[ APPROVE ]'}
        </button>
        <button
          className="odin-btn-yellow flex-1"
          onClick={act('pending', 'revise')}
          disabled={!!loading}
        >
          {loading === 'revise' ? '...' : '[ REVISE ]'}
        </button>
        <button
          className="odin-btn-red flex-1"
          onClick={act('failed', 'reject')}
          disabled={!!loading}
        >
          {loading === 'reject' ? '...' : '[ REJECT ]'}
        </button>
      </div>
    </div>
  )
}
