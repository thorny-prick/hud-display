import asyncio
import json
from typing import AsyncGenerator

_subscribers: list[asyncio.Queue] = []


def subscribe() -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.append(q)
    return q


def unsubscribe(q: asyncio.Queue):
    _subscribers.remove(q)


async def broadcast(event: dict):
    for q in list(_subscribers):
        await q.put(event)


async def event_stream(q: asyncio.Queue) -> AsyncGenerator[str, None]:
    try:
        while True:
            event = await q.get()
            yield f"data: {json.dumps(event)}\n\n"
    except asyncio.CancelledError:
        pass
    finally:
        unsubscribe(q)
