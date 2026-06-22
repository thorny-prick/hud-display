from fastapi import APIRouter, Depends
from backend.db.database import get_db

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/")
async def list_agents(db=Depends(get_db)):
    rows = await (await db.execute("SELECT * FROM agents ORDER BY id ASC")).fetchall()
    return [dict(r) for r in rows]
