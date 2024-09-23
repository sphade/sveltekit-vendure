import { UserStore } from '$houdini';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleFont: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		preload: ({ type }) => type === 'font'
	});

	return response;
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const myQuery = new UserStore();
	const { data } = await myQuery.fetch({ event });

	if (!data?.activeCustomer && event.url.pathname.startsWith('/me')) {
		throw redirect(303, '/');
	}
	return await resolve(event);
};

export const handle = sequence(handleFont, handleAuth);
