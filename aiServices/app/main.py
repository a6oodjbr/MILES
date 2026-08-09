from fastapi import FastAPI
from pydantic import BaseModel
from app.services.chat import ask
from app.services.itinerary import generate_itinerary
from app.services.rag import RAGService
from app.models.travel import TravelPreferences, TravelDataItem
from app.models.rag import ChatRequest, ChatResponse

app = FastAPI()
rag_service = RAGService()


class PromptRequest(BaseModel):
    prompt: str


class ItineraryRequest(BaseModel):
    preferences: TravelPreferences
    travel_data: list[TravelDataItem] = []


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.post("/chat/ask")
def ask_chat(request: PromptRequest):
    response = ask(request.prompt)
    return {"response": response}


@app.post("/itinerary")
def itinerary(request: ItineraryRequest):
    result = generate_itinerary(request.preferences, request.travel_data)
    return result


@app.post("/chat", response_model=ChatResponse)
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
    retrieved_chunks = []  # placeholder for retrieval logic, to be implemented later

    # 3. Generate answer using retrieved data + rewritten query
    answer = rag_service.generate_response(
        retrieved_chunks=retrieved_chunks,
        user_query=rewritten_query,
    )

    rag_service.add_to_history(
        user_query=request.message, formulated_query=rewritten_query, answer=answer
    )

    return ChatResponse(answer=answer)
