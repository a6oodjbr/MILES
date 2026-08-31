from operator import index

from azure.search.documents.indexes import SearchIndexClient

from app.clients.azure_search import get_search_client
from app.config import settings
from azure.core.credentials import AzureKeyCredential


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

    def search(self, query: str, top: int = 5):
        results = self.search_client.search(
            search_text=query,
            query_type="simple",
            top=top,
        )
        return results
    
    def get_default_scoring_profile(self):
        index = self.index_client.get_index(settings.AZURE_SEARCH_INDEX_NAME)

        return index.default_scoring_profile
    
    def get_scoring_profiles(self):
        index = self.index_client.get_index(
            settings.AZURE_SEARCH_INDEX_NAME
        )

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
