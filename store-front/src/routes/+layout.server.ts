import { GetActiveOrderStore, UserStore } from '$houdini';

export const load = async (event) => {
	const { data: user } = await new UserStore().fetch({ event });
	const { data: activeOrder } = await new GetActiveOrderStore().fetch({ event });

	return {
		user,
		activeOrder: activeOrder?.activeOrder
	};
};
