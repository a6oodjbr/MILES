from fastapi import APIRouter

from app.models.search import (
    SearchRequest,
    SearchResponse,
    SearchSchemaResponse,
    SearchResult,
)
from app.services.search import search_service


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get("/schema", response_model=SearchSchemaResponse)
def get_schema() -> SearchSchemaResponse:
    fields = search_service.get_schema()

    return SearchSchemaResponse(
        fields=fields,
    )


@router.post("", response_model=SearchResponse)
def search(request: SearchRequest) -> SearchResponse:
    query_vector = search_service.get_query_vector(request.query)
    results = search_service.search(
        query=request.query,
        top=request.top,
        threshold=request.threshold,
    )

    return SearchResponse(
        results=[SearchResult(document=dict(result)) for result in results],
        query_vector=query_vector,
    )


@router.post("/semantic", response_model=SearchResponse)
def semantic_search(request: SearchRequest) -> SearchResponse:
    results = search_service.semantic_search(
        query=request.query,
        top=request.top,
    )

    return SearchResponse(
        results=[SearchResult(document=dict(result)) for result in results]
    )


@router.post("/vector", response_model=SearchResponse)
def vector_search(request: SearchRequest) -> SearchResponse:
    query_vector = search_service.get_query_vector(request.query)
    results = search_service.search(
        query=request.query,
        top=request.top,
        threshold=request.threshold,
    )

    return SearchResponse(
        results=[SearchResult(document=dict(result)) for result in results],
        query_vector=query_vector,
    )


@router.post("/hybrid", response_model=SearchResponse)
def hybrid_search(request: SearchRequest) -> SearchResponse:
    query_vector = search_service.get_query_vector(request.query)
    results = search_service.search(
        query=request.query,
        top=request.top,
        threshold=request.threshold,
    )

    return SearchResponse(
        results=[SearchResult(document=dict(result)) for result in results],
        query_vector=query_vector,
    )


@router.get("/scoring-profiles", response_model=list)
def get_scoring_profiles():
    return search_service.get_scoring_profiles()


@router.get("/default-scoring-profile")
def get_default_scoring_profile():
    return search_service.get_default_scoring_profile()
