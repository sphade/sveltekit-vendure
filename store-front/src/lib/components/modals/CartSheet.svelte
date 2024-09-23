<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { formatCurrency } from '$lib/utils';
	import { ShoppingBasket } from 'lucide-svelte';
	import OrderList from '../OrderList.svelte';
	import { cartSheetStore } from '$lib/stores/modalStore';

	$: activeOrder = $page.data.activeOrder;

	$: total =
		activeOrder?.lines?.reduce((acc, line) => acc + line.quantity * line.unitPriceWithTax, 0) ||
		activeOrder?.subTotalWithTax;
</script>

<Sheet.Root open={$cartSheetStore} onOpenChange={cartSheetStore.toggleModal}>
	<Sheet.Content class="overflow-y-auto rounded-s-lg p-2 pt-10 sm:max-w-xl sm:p-4" side="right">
		<Sheet.Header>
			<Sheet.Title class="font-display mb-5 text-3xl ">Your Order</Sheet.Title>
		</Sheet.Header>
		<OrderList />
		<p class="my-5 capitalize md:my-0">
			total : <span class="font-semibold">{formatCurrency(total)}</span>
		</p>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button href="/checkout" class="h-[50px]" builders={[builder]}
					>Proceed To Checkout <ShoppingBasket class="ml-3 " />
				</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
