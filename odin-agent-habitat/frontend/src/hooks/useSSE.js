import { useEffect, useRef } from 'react'

export function useSSE(onEvent) {
  const handlerRef = useRef(onEvent)
  handlerRef.current = onEvent

  useEffect(() => {
    const es = new EventSource('/events/stream')

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        handlerRef.current(data)
      } catch {
        // ignore malformed events
      }
    }

    es.onerror = () => {
      // SSE will auto-reconnect; no action needed
    }

    return () => es.close()
  }, [])
}
