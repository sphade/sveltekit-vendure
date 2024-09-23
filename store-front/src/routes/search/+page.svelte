<script lan="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { page } from '$app/stores';
	import { ProductsStore } from '$houdini';
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterDesktop from '$lib/components/FilterDesktop.svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import SearchBar2 from '$lib/components/SearchBar2.svelte';
	import FilterModal from '$lib/components/FilterModal.svelte';

	export let data;

	const query = queryParam('term', ssp.string(), { debounceHistory: 1000 });

	$: allProducts = [...data.products.items];
	async function loadMore() {
		const stores = await new ProductsStore().fetch({
			variables: {
				skip: allProducts.length,
				take: 20,
				term: ''
			}
		});

		const extraStores = stores.data?.search.items || [];
		allProducts = [...allProducts, ...extraStores];
		totalItems = stores.data?.search.totalItems || 0;
	}
	$: totalItems = data.products.totalItems;
	$: hasNextPage = allProducts.length < totalItems;
</script>

<div class="mx-auto my-5 max-w-6xl md:my-20 lg:px-10">
	{#if $query}
		<h1 class="text-xl font-bold capitalize md:text-3xl">Search for "{$query}"</h1>
	{/if}
	<div class="my-5 flex items-center justify-between">
		<SearchBar2 />
		<FilterModal filters={data.products.facetValues} />
	</div>
	<section class="  flex w-full flex-col justify-between gap-6 lg:flex-row">
		{#if data?.products}
			{#if allProducts.length > 0}
				<div class="relative hidden basis-[200px] lg:inline-flex">
					<div class="sticky left-0 top-[5rem] flex flex-col gap-5">
						<FilterDesktop filters={data.products.facetValues} />
					</div>
				</div>
				<div class="flex flex-1 flex-col gap-5">
					<div class="category-section space-y-3 md:space-y-5">
						{#each allProducts as product}
							<div class="grid grid-cols-1 gap-4">
								<ProductCard
									productName={product.productName}
									productAsset={product.productAsset}
									description={product.description}
									priceWithTax={product.priceWithTax}
									currencyCode={product.currencyCode}
									slug={product.slug}
								/>
							</div>
						{/each}
					</div>
					{#if hasNextPage}
						<div class="mx-auto w-fit py-2">
							<Button on:click={loadMore} variant="outline">Show more</Button>
						</div>
					{/if}
				</div>
			{:else}
				<div class="grid h-[400px] w-full place-content-center place-items-center">
					<p class="text-center text-xl font-medium text-muted-foreground">
						No Product Found in the store
					</p>
				</div>
			{/if}
		{/if}
	</section>
</div>
