import { getPaymentMethods } from '$lib/queries';

export const load = async (event) => {
	const { data } = await getPaymentMethods.fetch({ event });
	return {
		paymentMethods: data?.eligiblePaymentMethods
	};
};
