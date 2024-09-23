import { HoudiniClient } from '$houdini';

export default new HoudiniClient({
	url: 'http://localhost:3000/shop-api',
	fetchParams: ({ text, variables, metadata }) => {
		return {
			method: 'POST',
			// headers,
			body: JSON.stringify({
				query: text,
				variables
			}),
			credentials: 'include',
			...metadata
		};
	}
});
