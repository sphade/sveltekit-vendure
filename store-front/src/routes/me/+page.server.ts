import { redirect } from '@sveltejs/kit';

export const load = async () => {
	redirect(303, '/me/personal-info');
};
