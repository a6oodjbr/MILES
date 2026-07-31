from fastapi import FastAPI

from app.core.config import settings
from app.routers import health, trip

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.include_router(health.router)
app.include_router(trip.router)