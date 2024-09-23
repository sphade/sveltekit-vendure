<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { adjustOrderLine, removeItemFromOrder } from '$lib/mutation';
	import { formatCurrency } from '$lib/utils';
	import { Loader, Loader2, Minus, Plus, Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Button from './ui/button/button.svelte';
	import VendureAsset from './VendureAsset.svelte';

	let isLoading = false;
	$: activeOrder = $page.data.activeOrder;

	async function decreaseCart(id: string, quantity: number) {
		activeOrder = {
			...activeOrder,
			lines: activeOrder.lines.map((item: { id: string; quantity: number }) =>
				item.id === id ? { ...item, quantity: item.quantity - 1 } : item
			)
		};
		toast.success('updated successfully');

		try {
			const result = await adjustOrderLine.mutate({
				orderLineId: id,
				quantity: quantity - 1
			});

			if (false) {
				// toast.error(result?.data?.adjustOrderLine?.message);
			}
		} catch (error) {
			toast.error('an error occurred while updating order');
		}
		invalidateAll();
	}

	async function increaseCart(id: string, quantity: number) {
		activeOrder = {
			...activeOrder,
			lines: activeOrder.lines.map((item: { id: string; quantity: number }) =>
				item.id === id ? { ...item, quantity: item.quantity + 1 } : item
			)
		};
		toast.success('updated successfully');

		try {
			const result = await adjustOrderLine.mutate({
				orderLineId: id,
				quantity: quantity + 1
			});
			if (result.data?.adjustOrderLine?.errorCode) {
				toast.error(result?.data?.adjustOrderLine?.message);
			}
		} catch (error) {
			toast.error('an error occurred while updating order');
		}

		invalidateAll();
	}
	async function removeCart(id: string) {
		activeOrder = {
			...activeOrder,
			lines: activeOrder.lines?.filter((item: { id: string }) => item.id !== id) ?? []
		};
		toast.success('Item removed successfully');
		try {
			await removeItemFromOrder.mutate({ orderLineId: id });
		} catch (e) {
			toast.error('Failed to remove item');
		}
		invalidateAll();
	}
</script>

<div class="grid gap-4 py-4">
	{#each activeOrder?.lines ?? [] as { featuredAsset, quantity, linePriceWithTax, id, productVariant } (id)}
		<div animate:flip={{ duration: 300 }} out:fly={{ x: 200, duration: 300 }}>
			<div
				class="flex justify-between gap-2 rounded-lg px-1 py-3 transition-colors hover:bg-slate-50"
			>
				<VendureAsset
					class="h-24 w-36 overflow-hidden rounded-xl  object-cover"
					preview={featuredAsset?.preview || './noImage.png'}
					preset="small"
					alt=""
				/>
				<div class="flex-1 space-y-1">
					<p class="font-semibold capitalize">{productVariant.name}</p>
					<!-- <p class="text-muted-foreground text-xs">
								{item.description}
							</p> -->
					<p class="text-sm text-primary">
						{formatCurrency(linePriceWithTax, activeOrder.currencyCode)}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<Button
						disabled={quantity === 1 || isLoading}
						on:click={async () => {
							if (quantity === 1) return;
							await decreaseCart(id, quantity);
						}}
						size="icon"><Minus /></Button
					>
					<button
						class="flex h-10 w-10 items-center justify-center rounded-md border-2 border-border"
					>
						{#if isLoading}
							<Loader2 class="size-4 animate-spin text-primary" />
						{:else}
							{quantity}
						{/if}
					</button>
					<Button
						disabled={isLoading}
						on:click={async () => await increaseCart(id, quantity)}
						size="icon"><Plus /></Button
					>
				</div>
			</div>
			<Button
				variant="outline"
				size="sm"
				class="w-fit border-destructive bg-destructive/5 text-destructive hover:bg-destructive/5 hover:text-destructive"
				on:click={async () => {
					await removeCart(id);
				}}
			>
				<Trash class="mr-3 size-4 " />
				{#if isLoading}
					<Loader />
				{:else}
					Delete item
				{/if}
			</Button>
		</div>
	{/each}
</div>
