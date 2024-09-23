import { updateEmail } from '$lib/mutation/index.js';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const {
		url: { searchParams }
	} = event;
	const token = searchParams.get('token') || '';
	if (!token) {
		error(401, 'no token available');
	}

	try {
		await updateEmail.mutate({ token }, { event });
	} catch {
		error(401, 'the token is invalid or has expired');
	}
};
