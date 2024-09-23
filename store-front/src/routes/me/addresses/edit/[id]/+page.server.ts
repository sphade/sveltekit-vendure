import { CountriesStore } from '$houdini';
import { addressSchema } from '$lib/schema.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { parent, params } = event;
	const { id } = params;
	const data = await parent();

	const address = data.user?.activeCustomer?.addresses?.find((address) => {
		return address.id === id;
	});
	if (!address) error(400, 'an error occurred');
	const form = await superValidate(
		{
			phone: address?.phoneNumber,
			name: address.fullName,
			city: address.city,
			state: address.province,
			postalCode: address.postalCode,
			country: address.country.code,
			apartment: address.streetLine2,
			isDefaultShipping: address.defaultShippingAddress,
			isDefaultBilling: address.defaultBillingAddress,
			address: address.streetLine1
		},
		zod(addressSchema)
	);
	const { data: countries } = await new CountriesStore().fetch({ event });

	return {
		address,
		form,
		countries: countries?.availableCountries
	};
};
