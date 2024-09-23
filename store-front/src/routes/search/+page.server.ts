import { GetTopLevelCollectionsStore, ProductsStore } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const { url } = event;

	const term = url.searchParams.get('term') || '';
	const collectionSlug = url.searchParams.get('collectionSlug') || '';
	const facetsString = url.searchParams.get('facetValueIds') || '[]';
	const facets = JSON.parse(facetsString) as string[];
	const facetValueFilters = facets.map((facetValueId) => ({
		and: facetValueId
	}));

	const { data } = await new ProductsStore().fetch({
		event,
		variables: { term, facetValueFilters, collectionSlug }
	});
	if (!data) {
		error(404, 'store not found');
	}
	const { data: collections } = await new GetTopLevelCollectionsStore().fetch({
		event
	});

	return {
		products: data?.search,
		collections: collections?.collections
	};
};
