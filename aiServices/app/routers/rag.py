from fastapi import APIRouter

from app.models import ChatRequest, ChatResponse
from app.services import RAGService

router = APIRouter(prefix="/chat", tags=["rag"])
rag_service = RAGService()


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    """/chat endpoint handles the chat interaction by rewriting the user's query, retrieving relevant information, and generating a response.

    Args:
        request (ChatRequest): The chat request containing the user's message.

    Returns:
        ChatResponse: The chat response containing the generated answer.
    """

    # 1. Rewrite latest question using history
    rewritten_query = rag_service.rewrite_query(
        latest_question=request.message,
    )
    print(f"Rewritten Query: {rewritten_query}")

    # 2. Retrieve using rewritten query
    retrieved_data = [
    {
        "city": "Paris",
        "country": "France",
        "type": "City",
        "best_time_to_visit": ["April", "May", "June", "September", "October"],
        "recommended_duration": "3-5 days",
        "description": "Paris is known for its art, architecture, history, museums, cafes, and landmarks.",
        "attractions": [
            "Eiffel Tower",
            "Louvre Museum",
            "Notre-Dame Cathedral",
            "Arc de Triomphe",
            "Montmartre",
            "Champs-Elysees"
        ],
        "activities": [
            "Visit museums and art galleries",
            "Explore historic neighborhoods",
            "Try French cuisine",
            "Take a Seine River cruise",
            "Visit local cafes"
        ],
        "travel_tips": [
            "Use the Metro to travel around the city",
            "Book popular attractions in advance",
            "Visit popular attractions early in the morning"
        ]
    },
    {
        "city": "Rome",
        "country": "Italy",
        "type": "City",
        "best_time_to_visit": ["April", "May", "June", "September", "October"],
        "recommended_duration": "3-5 days",
        "description": "Rome is famous for ancient Roman architecture, museums, churches, Italian cuisine, and archaeological sites.",
        "attractions": [
            "Colosseum",
            "Roman Forum",
            "Vatican Museums",
            "Trevi Fountain",
            "Pantheon",
            "Spanish Steps"
        ],
        "activities": [
            "Explore ancient Roman ruins",
            "Visit museums and historical sites",
            "Try authentic Italian food",
            "Explore local markets",
            "Visit Vatican City"
        ],
        "travel_tips": [
            "Wear comfortable shoes",
            "Visit major attractions early to avoid crowds",
            "Use public transportation for longer distances"
        ]
    },
    {
        "city": "Istanbul",
        "country": "Turkey",
        "type": "City",
        "best_time_to_visit": ["April", "May", "September", "October"],
        "recommended_duration": "3-5 days",
        "description": "Istanbul connects Europe and Asia and is known for its historic architecture, markets, mosques, cuisine, and Bosphorus views.",
        "attractions": [
            "Hagia Sophia",
            "Blue Mosque",
            "Topkapi Palace",
            "Grand Bazaar",
            "Galata Tower",
            "Bosphorus"
        ],
        "activities": [
            "Explore historic neighborhoods",
            "Visit traditional markets",
            "Take a Bosphorus cruise",
            "Try Turkish cuisine",
            "Visit historical mosques and palaces"
        ],
        "travel_tips": [
            "Use public transportation",
            "Use ferries to travel between the European and Asian sides",
            "Visit the Grand Bazaar during less busy hours"
        ]
    },
    {
        "city": "Dubai",
        "country": "United Arab Emirates",
        "type": "City",
        "best_time_to_visit": ["November", "December", "January", "February", "March"],
        "recommended_duration": "3-5 days",
        "description": "Dubai is known for modern architecture, luxury shopping, entertainment, beaches, and desert experiences.",
        "attractions": [
            "Burj Khalifa",
            "Dubai Mall",
            "Palm Jumeirah",
            "Dubai Marina",
            "Museum of the Future",
            "Dubai Creek"
        ],
        "activities": [
            "Visit observation decks",
            "Go shopping",
            "Relax at the beach",
            "Take a desert safari",
            "Explore modern architecture"
        ],
        "travel_tips": [
            "Avoid outdoor activities during the hottest parts of the day",
            "Use public transportation and taxis",
            "Plan outdoor activities during cooler hours"
        ]
    },
    {
        "city": "Kyoto",
        "country": "Japan",
        "type": "City",
        "best_time_to_visit": ["March", "April", "May", "October", "November"],
        "recommended_duration": "3-5 days",
        "description": "Kyoto is known for traditional Japanese culture, temples, gardens, historic streets, and seasonal scenery.",
        "attractions": [
            "Fushimi Inari Shrine",
            "Kinkaku-ji",
            "Arashiyama Bamboo Grove",
            "Kiyomizu-dera",
            "Gion District",
            "Philosopher's Path"
        ],
        "activities": [
            "Visit traditional temples",
            "Explore historic neighborhoods",
            "Experience Japanese tea culture",
            "Walk through traditional gardens",
            "Explore Arashiyama"
        ],
        "travel_tips": [
            "Use public transportation",
            "Visit popular attractions early to avoid crowds",
            "Respect local customs at temples and shrines"
        ]
    }
]  # placeholder for retrieval logic, to be implemented later

    # 3. Generate answer using retrieved data + rewritten query
    answer = rag_service.generate_response(
        retrieved_data=retrieved_data,
        user_query=rewritten_query,
    )
    
    rag_service.add_to_history(
        user_query=request.message,
        formulated_query=rewritten_query,
        answer=answer,
    )

    return ChatResponse(answer=answer)
