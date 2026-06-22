const BASE = ''

export async function fetchTasks() {
  const res = await fetch(`${BASE}/tasks`)
  return res.json()
}

export async function fetchAgents() {
  const res = await fetch(`${BASE}/agents`)
  return res.json()
}

export async function createTask(payload) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${BASE}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

export async function fetchTaskOutputs(taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/outputs`)
  return res.json()
}

export async function fetchTaskLogs(taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/logs`)
  return res.json()
}
