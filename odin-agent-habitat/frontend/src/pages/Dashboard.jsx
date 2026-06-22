import { useState, useEffect, useCallback } from 'react'
import { fetchTasks, fetchAgents, fetchTaskOutputs } from '../api/client'
import { useSSE } from '../hooks/useSSE'
import AgentCard from '../components/AgentCard'
import TaskForm from '../components/TaskForm'
import TaskQueue from '../components/TaskQueue'
import EventLog from '../components/EventLog'
import OutputPanel from '../components/OutputPanel'
import ApprovalButtons from '../components/ApprovalButtons'

export default function Dashboard() {
  const [tasks, setTasks]               = useState([])
  const [agents, setAgents]             = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [outputs, setOutputs]           = useState([])
  const [events, setEvents]             = useState([])

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null

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
          content: event.content,
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
    <div className="min-h-screen bg-odin-bg p-4 lg:p-6 flex flex-col gap-6">
      <div className="scanline-overlay" />

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-widest neon-glow-green text-odin-green animate-glitch">
            O.D.I.N
          </h1>
          <p className="text-xs text-odin-dim tracking-widest">
            Operational Design Intelligence Network — Agent Habitat v0.1
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-odin-dim">
          <span className="w-2 h-2 rounded-full bg-odin-green animate-pulse2" />
          SYSTEM ONLINE
        </div>
      </header>

      {/* Agent Grid */}
      <section>
        <div className="text-odin-cyan text-xs font-bold uppercase tracking-widest mb-3">
          // Active Agents ({agents.filter(a => a.status === 'working').length} working)
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
  )
}
