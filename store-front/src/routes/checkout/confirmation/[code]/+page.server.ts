import { GetOrderByCodeStore } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const { params } = event;
	const { code } = params;
	const { data } = await new GetOrderByCodeStore().fetch({ event, variables: { code } });
	if (!data?.orderByCode) {
		error(404, "this order doesn't exist anymore");
	}
	return {
		order: data.orderByCode
	};
};
