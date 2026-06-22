import { useState } from 'react'
import { createTask } from '../api/client'

const SERVICE_TYPES = [
  'YouTube Thumbnail',
  'Podcast Cover Art',
  'Social Media Banner',
  'Logo Design',
  'eBook Cover',
  'Ad Creative',
]

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({ title: '', brief: '', service_type: SERVICE_TYPES[0], style_notes: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.brief.trim()) return
    setLoading(true)
    try {
      const task = await createTask(form)
      onTaskCreated(task)
      setForm({ title: '', brief: '', service_type: SERVICE_TYPES[0], style_notes: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="odin-panel flex flex-col gap-4">
      <div className="text-odin-cyan text-xs font-bold uppercase tracking-widest mb-1">
        // New Task
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-odin-dim">Project Title</label>
        <input className="odin-input" placeholder="e.g. 10x Your Sales with These 5 Tricks" value={form.title} onChange={set('title')} required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-odin-dim">Service Type</label>
        <select className="odin-input" value={form.service_type} onChange={set('service_type')}>
          {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-odin-dim">Client Brief</label>
        <textarea
          className="odin-input resize-none"
          rows={4}
          placeholder="Describe what the client needs, their audience, and any specific requirements..."
          value={form.brief}
          onChange={set('brief')}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-odin-dim">Style Notes <span className="text-odin-dim/50">(optional)</span></label>
        <input className="odin-input" placeholder="e.g. dark, bold, cinematic, minimalist..." value={form.style_notes} onChange={set('style_notes')} />
      </div>

      <button type="submit" disabled={loading} className="odin-btn-green w-full mt-1 disabled:opacity-50">
        {loading ? '[ DISPATCHING... ]' : '[ LAUNCH PIPELINE ]'}
      </button>
    </form>
  )
}
