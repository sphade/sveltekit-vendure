<script lang="ts">
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	const facetParamsStore = queryParam('facetValueIds', ssp.array([]));
	const sortBy = ['Recommended', 'Rating', 'Delivery Time', 'Delivery Fee', 'Minimum Order'];
	let open = false;
	export let filters: {
		count: number;
		facetValue: { id: number; name: string; facet: { id: number; name: string } };
	}[];
	let localFilters = [...$facetParamsStore];
	function categorizeFacets(facets) {
		const categorized = {};
		facets.forEach(({ facetValue }) => {
			const { id, name, facet } = facetValue;
			if (!categorized[facet.name]) {
				categorized[facet.name] = [];
			}
			categorized[facet.name].push({ id, name });
		});
		return categorized;
	}
	$: categorizedFacets = categorizeFacets(filters);

	function handleFacetClick(facetId: string) {
		console.log('🚀 ~ handleFacetClick ~ facetId:', facetId);

		if (localFilters.includes(facetId)) {
			localFilters = localFilters.filter((id) => id !== facetId);
		} else {
			localFilters = [...localFilters, facetId];
		}
		applyFilters();
	}
	function applyFilters() {
		$facetParamsStore = [...localFilters];
	}

	function isFacetActive(id: string) {
		return localFilters.includes(id) || $facetParamsStore.includes(id);
	}
</script>

<div class="">
	{#each Object.entries(categorizedFacets) as [facetName, facetValues]}
		<h2 class="mt-5 text-lg font-semibold capitalize">{facetName}</h2>
		<div class="mt-7 space-y-5 pl-5">
			{#each facetValues as { id, name }}
				<div class="flex items-center space-x-4">
					<Checkbox
						onCheckedChange={() => handleFacetClick(id)}
						checked={localFilters.includes(id)}
						id="term-{id}"
						aria-labelledby="terms-label"
					/>
					<Label
						id="terms-label"
						for="term-{id}"
						class="activeMenu sideMenu cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{name}
					</Label>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="postcss">
	.sideMenu {
		position: relative;
		width: max-content;
		transition: width 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.sideMenu-active {
		position: relative;
		width: max-content;
		transition: width 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.sideMenu:hover.sideMenu::after {
		content: '';
		height: 2px;
		width: 100%;
		position: absolute;
		background-color: #f6b01e;
		bottom: -5px;
		left: 0;
		animation: activeMenu ease 0.5s;
	}
	.sideMenu-active::after {
		content: '';
		height: 2px;
		width: 100%;
		position: absolute;
		background-color: #f6b01e;
		bottom: -5px;
		left: 0;

		animation: activeMenu ease 0.5s;
	}
	@keyframes activeMenu {
		0% {
			width: 0;
		}
		100% {
			width: 100%;
		}
	}
	/* Your existing styles */

	.category-section {
		scroll-margin-top: 100px; /* Adjusts the scroll position */
	}

	.category-section h2 {
		padding-top: 1rem; /* Adds some padding at the top of each category */
		margin-bottom: 1rem;
		background-color: rgba(255, 255, 255, 0.9); /* Adjust based on your background color */
		backdrop-filter: blur(5px);
	}
</style>
