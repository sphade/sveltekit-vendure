<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Loader, Minus, Plus, Heart, Star } from 'lucide-svelte';
	import { formatCurrency } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';
	import VendureAsset from '$lib/components/VendureAsset.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { addItemToOrder } from '$lib/mutation';
	export let data: PageData;
	let selectedVariantId = data.product?.variants[0]?.id;
	$: selectedVariant = data.product?.variants.find((v) => v.id === selectedVariantId);
	let stock = 1;
	let loading = false;

	function handleAddToOrder() {
		if (selectedVariant?.stockLevel === 'OUT_OF_STOCK') {
			return;
		}
		loading = true;
		addItemToOrder
			.mutate({
				productVariantId: selectedVariant?.id || '',
				quantity: stock
			})
			.then((result) => {
				if (result?.data?.addItemToOrder?.errorCode) {
					toast.error(result?.data?.addItemToOrder?.message);
				} else {
					toast.success('added to order');
				}
			})
			.catch((error) => {
				toast.error('an error occurred while adding to order');
			})
			.finally(async () => {
				loading = false;
				await invalidateAll();
			});
	}
</script>

<div class="mx-auto w-full max-w-6xl px-3 xl:px-0">
	<h1 class=" mt-3 text-2xl font-semibold capitalize md:mt-5 md:text-4xl">{data.product?.name}</h1>

	<div class="mt-5 flex flex-col gap-5 md:mt-10 md:flex-row">
		<Carousel.Root class="h-[300px] w-full rounded-md border md:h-[400px] md:w-[550px] ">
			<Carousel.Content class="-ml-1 h-fit">
				{#if selectedVariant?.assets && selectedVariant?.assets.length > 0}
					{#each selectedVariant?.assets ?? [] as asset, i (asset.id)}
						<Carousel.Item class="pl-1">
							<VendureAsset
								class="h-[300px] w-full rounded-md object-contain p-1 md:h-[400px]  md:w-[550px]"
								preview={asset.preview}
								preset="large"
								alt={asset.id}
							/>
						</Carousel.Item>
					{/each}
				{:else}
					{#each data.product?.assets ?? [] as asset, i (asset.id)}
						<Carousel.Item class="pl-1">
							<VendureAsset
								class="h-[300px] w-full rounded-md p-1 md:h-[400px] md:w-[550px]"
								preview={asset.preview}
								preset="large"
								alt={asset.id}
							/>
						</Carousel.Item>
					{/each}
				{/if}
			</Carousel.Content>
		</Carousel.Root>

		<div class="flex-1 space-y-3">
			<div class="relative h-fit">
				<p class="space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
					{@html data.product?.description}
				</p>
			</div>
			<div>
				<p class="mb-2">Select option</p>

				<select
					class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					bind:value={selectedVariantId}
				>
					{#each data.product?.variants as variant}
						<option class="capitalize" value={variant.id}>{variant.name}</option>
					{/each}
				</select>
			</div>
			<div
				class="fixed bottom-0 flex w-full items-center gap-2 border bg-background p-1 px-3 py-3 md:static md:border-none md:p-4 md:px-1"
			>
				<div class="flex items-center gap-4 rounded-lg border border-primary/10 bg-primary/10 p-2">
					<Button
						size="icon"
						on:click={() => {
							if (stock > 1) {
								stock--;
							}
						}}
						variant="outline"
						disabled={stock === 1}
					>
						<Minus />
					</Button>
					<p class="text-xl font-normal text-primary">{stock}</p>
					<Button
						on:click={() => {
							stock++;
						}}
						size="icon"
						variant="outline"
					>
						<Plus />
					</Button>
				</div>
				<Button
					type="submit"
					size="lg"
					class="flex-1  justify-between py-7 shadow-lg transition-all"
					disabled={selectedVariant?.stockLevel === 'OUT_OF_STOCK' || loading}
					on:click={handleAddToOrder}
				>
					{#if loading}
						<Loader class="size-5 animate-spin" />
					{:else}
						<span class="font-bold capitalize">add to order</span>
					{/if}
					{formatCurrency(
						Number(selectedVariant?.priceWithTax) * stock,
						selectedVariant?.currencyCode
					)}
				</Button>
			</div>
		
			<div class="flex items-center gap-4 text-sm">
				<p class="text-lg text-muted-foreground">
					{selectedVariant?.sku || data.product?.variants[0].sku}
				</p>
				{#if selectedVariant?.stockLevel === 'OUT_OF_STOCK'}
					<Badge variant="destructive">Out of Stock</Badge>
				{:else if selectedVariant?.stockLevel === 'IN_STOCK'}
					<Badge class="bg-green-500 hover:bg-green-500">In Stock</Badge>
				{/if}
			</div>

			<div class="pt-3">
				<p class="text-sm font-bold">Shipping & Returns</p>
				<p class="text-xs text-muted-foreground">
					Standard shipping: 3 - 5 working days. Express shipping: 1 - 3 working days. Shipping
					costs depend on delivery address and will be calculated during checkout. Returns are
					subject to terms. Please see the RETURNS PAGE for further information.
				</p>
			</div>
		</div>
	</div>

	
</div>
