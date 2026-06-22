import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "../../data/odin.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")


async def get_db():
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()


async def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        with open(SCHEMA_PATH, "r") as f:
            await db.executescript(f.read())
        await db.commit()
