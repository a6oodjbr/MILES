from datetime import date, time
from typing import List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class Activity(BaseModel):
    name: str = Field(..., min_length=1)
    start_time: time
    duration_minutes: int = Field(..., gt=0)
    location: Optional[str] = None
    description: Optional[str] = None


class DayPlan(BaseModel):
    day_number: int = Field(..., ge=1)
    date: date
    activities: List[Activity] = Field(default_factory=list)


class Itinerary(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    trip_request_id: str  # links back to the TripRequestResponse.request_id
    destination: str
    days: List[DayPlan] = Field(default_factory=list)
