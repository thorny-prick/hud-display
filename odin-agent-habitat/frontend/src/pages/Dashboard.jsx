import { useState, useEffect, useCallback } from 'react'
import { SHORT_NAME, TAGLINE, SYSTEM_STATUS_LABEL } from '../config/branding'
import { fetchTasks, fetchAgents, fetchTaskOutputs } from '../api/client'
import { useSSE } from '../hooks/useSSE'
import AgentCard from '../components/AgentCard'
import TaskForm from '../components/TaskForm'
import TaskQueue from '../components/TaskQueue'
import EventLog from '../components/EventLog'
import OutputPanel from '../components/OutputPanel'
import ApprovalButtons from '../components/ApprovalButtons'
import PipelineTimeline from '../components/PipelineTimeline'
import AgentHabitat from '../components/AgentHabitat'

export default function Dashboard() {
  const [tasks, setTasks]                   = useState([])
  const [agents, setAgents]                 = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [outputs, setOutputs]               = useState([])
  const [events, setEvents]                 = useState([])
  const [time, setTime]                     = useState(() => new Date())

  const selectedTask  = tasks.find((t) => t.id === selectedTaskId) || null
  const activeAgents  = agents.filter(a => a.status === 'working').length
  const activeTasks   = tasks.filter(t => !['complete', 'failed'].includes(t.status)).length
  const timeStr       = time.toUTCString().slice(17, 25)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetchTasks().then(setTasks)
    fetchAgents().then(setAgents)
  }, [])

  useEffect(() => {
    if (!selectedTaskId) { setOutputs([]); return }
    fetchTaskOutputs(selectedTaskId).then(setOutputs)
  }, [selectedTaskId])

  const handleSSE = useCallback((event) => {
    if (event.type === 'log') {
      setEvents((prev) => [...prev.slice(-199), event])
    }
    if (event.type === 'agent_status') {
      setAgents((prev) =>
        prev.map((a) =>
          a.name === event.agent
            ? { ...a, status: event.status, current_task_id: event.task_id }
            : a
        )
      )
    }
    if (event.type === 'task_status') {
      setTasks((prev) =>
        prev.map((t) => t.id === event.task_id ? { ...t, status: event.status } : t)
      )
    }
    if (event.type === 'output') {
      if (event.task_id === selectedTaskId) {
        setOutputs((prev) => [...prev, {
          agent_name: event.agent,
          content:    event.content,
          output_type: event.output_type,
        }])
      }
    }
  }, [selectedTaskId])

  useSSE(handleSSE)

  const handleTaskCreated = (task) => {
    fetchTasks().then((all) => {
      setTasks(all)
      setSelectedTaskId(task.id)
    })
  }

  const handleStatusChange = (taskId, status) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t))
  }

  const handleSelect = (id) => {
    setSelectedTaskId(id)
    setOutputs([])
    fetchTaskOutputs(id).then(setOutputs)
  }

  return (
    <div className="min-h-screen bg-odin-bg flex flex-col">
      <div className="scanline-overlay" />

      {/* ── Mission Control Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-odin-surface/80 border-b border-odin-green/30">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">

          {/* Left — Logo */}
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-bold tracking-widest text-odin-green neon-glow-green animate-glitch">
              {SHORT_NAME}
            </h1>
            <p className="text-[9px] text-odin-dim tracking-widest hidden sm:block mt-0.5">
              {TAGLINE.toUpperCase()}
            </p>
          </div>

          {/* Center — Live clock */}
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold tabular-nums tracking-widest text-odin-cyan neon-glow-cyan">
              {timeStr}
            </div>
            <div className="text-[9px] text-odin-dim tracking-widest">UTC</div>
          </div>

          {/* Right — System stats */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-odin-dim tracking-widest text-[9px]">AGENTS</span>
              <span className={activeAgents > 0 ? 'text-odin-green font-bold' : 'text-odin-dim'}>
                {activeAgents > 0 ? `${activeAgents} ACTIVE` : 'ALL IDLE'}
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-odin-dim tracking-widest text-[9px]">QUEUE</span>
              <span className={activeTasks > 0 ? 'text-odin-yellow font-bold' : 'text-odin-dim'}>
                {activeTasks} TASK{activeTasks !== 1 ? 'S' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-odin-green animate-pulse2 shrink-0" />
              <span className="text-odin-green font-bold tracking-widest text-[10px]">{SYSTEM_STATUS_LABEL}</span>
            </div>
          </div>
        </div>

        {/* Animated sweep line */}
        <div className="h-px header-sweep" />
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">

        {/* Pipeline Timeline */}
        <PipelineTimeline agents={agents} outputs={outputs} />

        {/* Agent Habitat Map */}
        <AgentHabitat agents={agents} outputs={outputs} />

        {/* Agent Grid */}
        <section>
          <div className="text-odin-cyan text-xs font-bold uppercase tracking-widest mb-3">
            // Active Agents ({activeAgents} working)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
          </div>
        </section>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <TaskForm onTaskCreated={handleTaskCreated} />
            <TaskQueue tasks={tasks} selectedTaskId={selectedTaskId} onSelect={handleSelect} />
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <EventLog events={events} />
            {selectedTask && (
              <ApprovalButtons task={selectedTask} onStatusChange={handleStatusChange} />
            )}
            <OutputPanel outputs={outputs} />
          </div>
        </div>
      </div>
    </div>
  )
}
