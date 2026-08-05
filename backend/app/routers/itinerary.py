from fastapi import APIRouter

router = APIRouter(prefix="/itinerary", tags=["itinerary"])

itinerary_data = [
    {
        "destination": "Tokyo, Japan",
        "startDate": "2026-08-15",
        "endDate": "2026-08-22",
        "travelers": 2,
        "budget": "$2,000",
        "estimatedSpent": "$183",
        "days": [
            {
                "day": 1,
                "activities": [
                    {
                        "title": "Senso-ji Temple",
                        "category": "culture",
                        "time": "9:00 AM",
                        "duration": "2h",
                        "description": "Tokyo's oldest temple and a must-visit. Arrive early to beat the crowds.",
                        "location": "Asakusa, Tokyo",
                        "transport": "Subway",
                        "cost": "Free",
                        "weather": "28\u00b0C",
                        "icon": "torii",
                    },
                    {
                        "title": "Tsukiji Outer Market",
                        "category": "food",
                        "time": "11:30 AM",
                        "duration": "1.5h",
                        "description": "Fresh sushi breakfast and street food. Try the tamagoyaki and tuna sashimi.",
                        "location": "Tsukiji, Tokyo",
                        "transport": "Subway",
                        "cost": "$25",
                        "weather": "31\u00b0C",
                        "icon": "sushi",
                    },
                    {
                        "title": "Shibuya Crossing & Shopping",
                        "category": "culture",
                        "time": "2:00 PM",
                        "duration": "3h",
                        "description": "Experience the world's busiest pedestrian crossing and explore the trendy districts.",
                        "location": "Shibuya, Tokyo",
                        "transport": "Subway",
                        "cost": "$80",
                        "weather": "29\u00b0C",
                        "icon": "building",
                    },
                    {
                        "title": "Dinner at Ichiran Ramen",
                        "category": "dining",
                        "time": "7:00 PM",
                        "duration": "2h",
                        "description": "The iconic solo-dining ramen experience. Customize your broth to perfection.",
                        "location": "Shibuya, Tokyo",
                        "transport": "Walking",
                        "cost": "$18",
                        "weather": "24\u00b0C",
                        "icon": "ramen",
                    },
                ],
            },
            {
                "day": 2,
                "activities": [
                    {
                        "title": "Shinjuku Gyoen National Garden",
                        "category": "nature",
                        "time": "8:00 AM",
                        "duration": "4h",
                        "description": "A serene escape in the heart of Tokyo. Beautiful Japanese landscaping.",
                        "location": "Shinjuku, Tokyo",
                        "transport": "Subway",
                        "cost": "$5",
                        "weather": "27\u00b0C",
                        "icon": "nature",
                    },
                    {
                        "title": "TeamLab Borderless",
                        "category": "art",
                        "time": "1:00 PM",
                        "duration": "3h",
                        "description": "Immersive digital art museum. Book tickets in advance - sells out fast.",
                        "location": "Odaiba, Tokyo",
                        "transport": "Bus",
                        "cost": "$35",
                        "weather": "30\u00b0C",
                        "icon": "art",
                    },
                    {
                        "title": "Tokyo Tower Sunset View",
                        "category": "sightseeing",
                        "time": "6:00 PM",
                        "duration": "2h",
                        "description": "Catch the golden hour from Tokyo Tower's observation deck.",
                        "location": "Minato, Tokyo",
                        "transport": "Subway",
                        "cost": "$20",
                        "weather": "26\u00b0C",
                        "icon": "building",
                    },
                ],
            },
        ],
    }
]  # this is a placeholder for the itinerary data, you can replace it with actual data or a database query in the future


@router.get("")
def get_itinerary():
    return {"data": itinerary_data}
