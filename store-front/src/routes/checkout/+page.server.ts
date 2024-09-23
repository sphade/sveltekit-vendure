import { CountriesStore, GetShippingMethodsStore } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const { parent } = event;
	const { data: eligibleShippingMethods } = await new GetShippingMethodsStore().fetch({ event });
	const { data: availableCountries } = await new CountriesStore().fetch({ event });
	const { activeOrder } = await parent();

	if (!activeOrder?.totalQuantity) error(400, 'No item in your cart');

	return {
		shippingMethods: eligibleShippingMethods?.eligibleShippingMethods,
		countries: availableCountries?.availableCountries
	};
};
