<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { formatCurrency } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { addPaymentToOrder, transitionToState } from '$lib/mutation';
	import { goto } from '$app/navigation';

	export let data: PageData;
	$: activeOrder = data?.activeOrder;
</script>

<Breadcrumb.Root class="mx-auto my-10 w-fit">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link>Shipping</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link>Payment</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Confirmation</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
<div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2">
	<div class="grid place-items-center">
		<div class="space-y-3 text-center">
			<p>This is a dummy payment for demonstration purposes only</p>
			<div class="flex flex-col gap-5">
				{#each data.paymentMethods ?? [] as paymentMethod}
					<Button
						on:click={async () => {
							if (!paymentMethod.isEligible) {
								toast.error(`you are not eligible to use ${paymentMethod.name}`);
								return;
							}
							try {
								if (activeOrder?.state === 'AddingItems') {
									const transitionResult = await transitionToState.mutate({
										state: 'ArrangingPayment'
									});
									if (transitionResult?.data?.transitionOrderToState?.errorCode) {
										toast.error(transitionResult.data.transitionOrderToState?.transitionError);
										return;
									}
								}
								const paymentResult = await addPaymentToOrder.mutate({
									input: {
										method: 'standard-payment',
										metadata: {
											shouldDecline: false,
											shouldError: false,
											shouldErrorOnSettle: false
										}
									}
								});

								// Check transitionToState result

								// Check addPaymentToOrder result
								if (paymentResult.data?.addPaymentToOrder?.errorCode) {
									toast.error(paymentResult.data?.addPaymentToOrder?.message);
									return;
								}

								// Check for errors in paymentResult
								if (paymentResult.errors && paymentResult.errors.length > 0) {
									toast.error(paymentResult.errors[0].message);
									return;
								}

								// If all checks pass, navigate to confirmation
								await goto(`confirmation/${activeOrder?.code}`, {
									invalidateAll: true
								});
							} catch (error) {
								toast.error('An error occurred while processing your payment. Please try again.');
							}
						}}
						disabled={!paymentMethod.isEligible}>{paymentMethod.name}</Button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="px-10">
		<h1 class="text-xl font-semibold capitalize">Order Summary</h1>
		<div class="space-y-3 divide-y">
			{#each data?.activeOrder?.lines ?? [] as { featuredAsset, quantity, linePriceWithTax, id, productVariant } (id)}
				<div
					class="flex justify-between gap-5 rounded-lg px-1 py-3 transition-colors hover:bg-slate-50"
				>
					<img src={featuredAsset?.preview} class="h-24 w-36 rounded-md object-cover" alt="" />
					<div class="flex-1 space-y-3">
						<p class="font-semibold capitalize">{productVariant.name}</p>

						<p class="text-sm text-primary">
							{formatCurrency(linePriceWithTax, data?.activeOrder?.currencyCode)}
						</p>
					</div>
					<button class="h-10 w-10 rounded-md border-2 border-border"> {quantity} </button>
				</div>
			{/each}
			<div class="space-y-5 py-5">
				<div class="flex items-center justify-between">
					<p>Subtotal</p>
					<p>
						{formatCurrency(data?.activeOrder?.subTotalWithTax, data?.activeOrder?.currencyCode)}
					</p>
				</div>
				<div class="flex items-center justify-between">
					<p>Shipping</p>
					<p>
						{formatCurrency(data?.activeOrder?.shippingWithTax, data?.activeOrder?.currencyCode)}
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<p class="py-5 font-semibold">Total</p>
				<p>{formatCurrency(data?.activeOrder?.totalWithTax, data?.activeOrder?.currencyCode)}</p>
			</div>
		</div>
	</div>
</div>
