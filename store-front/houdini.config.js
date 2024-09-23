/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: 'http://localhost:3000/shop-api'
	},
	plugins: {
		'houdini-svelte': {
			defaultRouteBlocking: true
		}
	},
	features: {
		imperativeCache: true
	},
	scalars: {
		// This tells codegen that the `Money` scalar is a number
		Money: {
			type: 'Number'
		},
		JSON: {
			type: 'Json'
		}
	}
};

export default config;
