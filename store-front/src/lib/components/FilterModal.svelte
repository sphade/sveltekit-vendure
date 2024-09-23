<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { SlidersHorizontal } from 'lucide-svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { Button } from '$lib/components/ui/button';

	const facetParamsStore = queryParam('facetValueIds', ssp.array([]));

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

<Dialog.Root bind:open>
	<Dialog.Content class="w-full ">
		<Dialog.Header class="p-5">
			<Dialog.Title class="font-display text-3xl">Filter</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-5 p-5">
			{#each Object.entries(categorizedFacets) as [facetName, facetValues]}
				<div>
					<h2 class="font-display mb-2 text-xl font-semibold capitalize">{facetName}</h2>
					<div class="flex flex-wrap items-center gap-2">
						{#each facetValues as { id, name }}
							<Button
								variant={localFilters.includes(id) ? 'default' : 'outline'}
								on:click={() => handleFacetClick(id)}
								class="rounded-3xl capitalize hover:border-primary"
							>
								{name}
							</Button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<div class="sticky bottom-0 bg-background p-3">
			<Button
				on:click={() => {
					open = false;
				}}
				class="w-full   shadow-md"
				size="lg"
				variant="secondary">Close filter</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<Button
	variant="link"
	on:click={() => {
		open = true;
	}}
	class="group lg:hidden "
>
	<SlidersHorizontal
		class="ml-2 h-10 w-10 rounded-full bg-primary/20 p-2 transition-colors group-hover:bg-primary/30"
	/>
</Button>
