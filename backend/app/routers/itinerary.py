from fastapi import APIRouter
from app.schemas.itinerary import Itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])

itinerary_data: list[Itinerary] = []


@router.get("")
def health_check_itinerary():
    return {"data": itinerary_data}


@router.get("")
def get_itineraries():
    return {"data": itinerary_data}
