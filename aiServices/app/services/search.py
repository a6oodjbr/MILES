from azure.core.credentials import AzureKeyCredential
from azure.search.documents.indexes import SearchIndexClient

from app.clients.azure_openai import get_embedding_client
from app.clients.azure_search import get_search_client
from app.config import settings


class SearchService:
    def __init__(self):
        self.search_client = get_search_client()

        self.index_client = SearchIndexClient(
            endpoint=settings.AZURE_SEARCH_ENDPOINT,
            credential=AzureKeyCredential(settings.AZURE_SEARCH_API_KEY),
        )

    def get_schema(self):
        """Return the schema/fields of the Azure AI Search index."""
        index = self.index_client.get_index(settings.AZURE_SEARCH_INDEX_NAME)

        return [
            {
                "name": field.name,
                "type": field.type,
                "searchable": field.searchable,
                "filterable": field.filterable,
                "sortable": field.sortable,
                "facetable": field.facetable,
                "key": field.key,
            }
            for field in index.fields
        ]

    def search(self, query: str, top: int = 5, threshold: float | None = None):
        try:
            embedding = self._embed_query(query)
        except ValueError:
            results = self.search_client.search(
                search_text=query,
                query_type="simple",
                top=top,
            )
        else:
            results = self.search_client.search(
                search_text=query,
                vector_queries=[
                    {
                        "kind": "vector",
                        "vector": embedding,
                        "k": top,
                        "fields": "contentVector",
                    }
                ],
                query_type="simple",
                top=top,
            )

        results_list = list(results)
        if threshold is not None:
            results_list = [
                result
                for result in results_list
                if float(result.get("@search.score", result.get("score", 0)))
                >= threshold
            ]
        return results_list

    def _get_embedding_settings(self):
        endpoint = (
            settings.AZURE_OPENAI_EMBEDDING_ENDPOINT
            or settings.AZURE_OPENAI_ENDPOINT
            or ""
        )
        api_key = (
            settings.AZURE_OPENAI_EMBEDDING_API_KEY
            or settings.AZURE_OPENAI_API_KEY
            or ""
        )
        deployment = (
            settings.AZURE_OPENAI_EMBEDDING_DEPLOYMENT
            or settings.AZURE_OPENAI_DEPLOYMENT
            or ""
        )
        model_name = settings.AZURE_OPENAI_EMBEDDING_MODEL or "text-embedding-3-small"
        return endpoint, api_key, deployment, model_name

    def get_query_vector(self, query: str):
        try:
            return self._embed_query(query)
        except ValueError:
            return None

    def _embed_query(self, query: str):
        deployment = (
            settings.AZURE_OPENAI_EMBEDDING_DEPLOYMENT
            or settings.AZURE_OPENAI_DEPLOYMENT
            or ""
        )
        if not deployment:
            raise ValueError("Azure OpenAI embedding deployment is missing.")

        client = get_embedding_client()
        response = client.embeddings.create(
            model=deployment,
            input=query,
        )
        return response.data[0].embedding

    def _get_semantic_configuration_name(self):
        index = self.index_client.get_index(settings.AZURE_SEARCH_INDEX_NAME)
        semantic_search = getattr(index, "semantic_search", None)
        configurations = getattr(semantic_search, "configurations", None) or []
        if configurations:
            return configurations[0].name
        return None

    def semantic_search(self, query: str, top: int = 5):
        return list(
            self.search_client.search(
                search_text=query,
                query_type="semantic",
                semantic_configuration_name=self._get_semantic_configuration_name(),
                top=top,
            )
        )

    def get_default_scoring_profile(self):
        index = self.index_client.get_index(settings.AZURE_SEARCH_INDEX_NAME)

        return index.default_scoring_profile

    def get_scoring_profiles(self):
        index = self.index_client.get_index(settings.AZURE_SEARCH_INDEX_NAME)

        return [
            {
                "name": profile.name,
                "functions": [
                    {
                        "type": function.type,
                        "field_name": function.field_name,
                        "boost": function.boost,
                        "interpolation": function.interpolation,
                    }
                    for function in profile.functions
                ],
            }
            for profile in index.scoring_profiles
        ]


search_service = SearchService()
