import { ProductDetailsStore } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const { data } = await new ProductDetailsStore().fetch({
		event,
		variables: { slug: event.params.id }
	});
	if (!data?.product) {
		error(404, 'product not found');
	}
	return {
		product: data?.product
	};
};
