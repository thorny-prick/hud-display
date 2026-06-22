from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from backend.core.event_bus import subscribe, event_stream

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/stream")
async def stream_events():
    q = subscribe()
    return StreamingResponse(
        event_stream(q),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
