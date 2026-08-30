from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top: int = Field(default=5, ge=1, le=50)


class SearchResult(BaseModel):
    document: dict


class SearchResponse(BaseModel):
    results: list[SearchResult]


class SearchField(BaseModel):
    name: str
    type: str
    searchable: bool | None = None
    filterable: bool | None = None
    sortable: bool | None = None
    facetable: bool | None = None
    key: bool | None = None


class SearchSchemaResponse(BaseModel):
    fields: list[SearchField]
