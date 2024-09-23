import { CountriesStore } from '$houdini';

export const load = async (event) => {
	const { data } = await new CountriesStore().fetch({ event });
	return {
		countries: data?.availableCountries
	};
};
