import { verifyAccount } from '$lib/mutation/index.js';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const {
		url: { searchParams }
	} = event;
	const token = searchParams.get('token') || '';
	if (!token) {
		error(401, 'no token avaliable');
	}

	try {
		const result = await verifyAccount.mutate({ token }, { event });

		if (result.data?.verifyCustomerAccount.__typename !== 'CurrentUser') {
			error(401, 'the token is invalid or has expired');
		}
	} catch (e) {
		error(401, 'the token is invalid or has expired');
	}
};
