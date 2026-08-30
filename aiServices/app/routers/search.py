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
    results = search_service.search(
        query=request.query,
        top=request.top,
    )

    return SearchResponse(
        results=[SearchResult(document=dict(result)) for result in results]
    )
