<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Bike, ChevronRight, CreditCard, Loader2, Minus, Plus } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import GuestContact from './components/GuestContact.svelte';
	import GuestShippingInformation from './components/GuestShippingInformation.svelte';
	import { formatCurrency } from '$lib/utils';
	import OrderList from '$lib/components/OrderList.svelte';
	import { setShippingMethod, transitionToState } from '$lib/mutation';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { setOrderShippingAddress } from '$lib/mutation';
	import { setCustomerForOrder } from '$lib/mutation';

	export let data;
	$: activeOrder = data.activeOrder as any;
	let userAddresses = data.user?.activeCustomer?.addresses;
	$: defaultAddress = userAddresses?.find((address) => {
		return address.defaultShippingAddress === true;
	});
	let loading = false;
	let shippingMethodId = data?.shippingMethods?.[0]?.id || '';
	$: shippingMethod = data?.shippingMethods?.find((method) => method.id === shippingMethodId);
	let contactForm: GuestContact;
	let shippingForm: GuestShippingInformation;
	async function authCheckout() {
		try {
			if (data.user?.activeCustomer && !defaultAddress) {
				toast.error("You haven't set a delivery address yet");
				return;
			}
			loading = true;
			if (defaultAddress) {
				const addressResult = await setOrderShippingAddress.mutate({
					input: {
						fullName: defaultAddress.fullName,
						city: defaultAddress.city,
						streetLine1: defaultAddress.streetLine1,
						streetLine2: defaultAddress.streetLine2,
						postalCode: defaultAddress.postalCode,
						countryCode: defaultAddress.country.code,
						phoneNumber: defaultAddress.phoneNumber,
						province: defaultAddress.province
					}
				});
				const shippingResult = await setShippingMethod.mutate({ id: [shippingMethodId] });
				if (shippingResult.data && shippingResult.data.setOrderShippingMethod.errorCode) {
					loading = false;

					return toast.error(shippingResult.data.setOrderShippingMethod.message);
				}
				loading = false;

				await goto('/checkout/payment', { invalidateAll: true });
			}
		} catch (error) {
			toast.error(error.message || 'An error occurred during checkout');
		} finally {
			loading = false;
		}
	}
	async function guestCheckout() {
		const contactValid = await contactForm.form.validateForm({ update: true });
		const shippingValid = await shippingForm.form.validateForm({ update: true });
		if (contactValid.valid && shippingValid.valid) {
			loading = true;
			const { email, firstName, lastName } = contactValid.data;

			const contactRes = await setCustomerForOrder.mutate({
				input: {
					emailAddress: email,
					firstName,
					lastName
				}
			});
			if (contactRes.data?.setCustomerForOrder?.errorCode) {
				loading = false;
				toast.error(contactRes.data?.setCustomerForOrder?.message);
				return;
			}

			const { address, city, country, name, phone, postalCode, state, apartment } =
				shippingValid.data;
			const shippingRes = await setOrderShippingAddress.mutate({
				input: {
					fullName: name,
					city,
					streetLine1: address,
					streetLine2: apartment,
					postalCode,
					countryCode: country,
					phoneNumber: phone,
					province: state
				}
			});
			const shippingResult = await setShippingMethod.mutate({ id: [shippingMethodId] });
			if (shippingResult.data && shippingResult.data.setOrderShippingMethod.errorCode) {
				loading = false;

				return toast.error(shippingResult.data.setOrderShippingMethod.message);
			}
			loading = false;

			await goto('/checkout/payment', { invalidateAll: true });
		}
	}
	async function checkOut() {
		data.user?.activeCustomer ? authCheckout() : guestCheckout();
	}
</script>

<main>
	<div
		class="relative flex h-[400px] w-full flex-col border-b-2 bg-[url('/hero/hero-3.jpg')] bg-cover bg-fixed bg-no-repeat"
	>
		<div class="absolute top-[314px] z-50 h-3 w-full bg-white/5 backdrop-blur-sm sm:hidden"></div>
		<div class="absolute left-0 top-0 z-0 h-full w-full bg-black/50"></div>

		<div class=" pt-40 md:pt-44 lg:pt-56">
			<div
				class="  z-10 my-0 flex w-full max-w-md flex-col justify-center gap-7 border border-white/20 bg-white/20 px-4 py-3 text-white shadow-md drop-shadow-md backdrop-blur sm:rounded-r-md md:max-w-3xl md:gap-10 md:px-10"
			>
				<div class="flex flex-col gap-1 drop-shadow-md md:gap-2">
					<h2 class="font-display text-3xl font-bold md:text-6xl">Checkout</h2>
					<h4 class="text-xl font-semibold md:text-2xl">Kebab Royal</h4>
				</div>
			</div>
		</div>
	</div>

	<section
		class="m-auto my-0 flex h-full w-full max-w-6xl flex-col gap-5 px-2 py-5 sm:px-4 md:px-10 md:py-20 lg:flex-row lg:justify-between xl:px-0"
	>
		<div class="flex w-full flex-col gap-10 md:gap-10 lg:gap-20">
			{#if data.user?.activeCustomer}
				<div class="flex flex-col gap-4">
					<h4
						class="font-display text-lg font-semibold leading-loose tracking-wide md:text-2xl lg:text-3xl"
					>
						Delivery method
					</h4>
					<ul class="flex flex-col gap-1">
						<a
							href="/me/addresses"
							class="flex h-[auto] w-full cursor-pointer items-center justify-between rounded border-b py-5 transition-[shadow] md:border md:border-[#2021251f] md:px-4 md:hover:shadow lg:max-w-[600px]"
						>
							<div class="flex items-center gap-3">
								<Bike />
								<p class="text-sm font-normal md:text-base">
									{#if defaultAddress}
										This delivery would be made to <span
											class="font-medium capitalize text-muted-foreground"
											>{defaultAddress.fullName}</span
										> , (change it)
									{:else}
										Please add a delivery address or set one as your default
									{/if}
								</p>
							</div>
							<ChevronRight />
						</a>
					</ul>
				</div>
				<RadioGroup.Root bind:value={shippingMethodId} class="gap-5 md:gap-10">
					{#each data.shippingMethods ?? [] as shippingMethod}
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value={shippingMethod.id} id={shippingMethod.id} />
							<Label for={shippingMethod.id}>
								{shippingMethod.name}
								<span class="text-muted-foreground">
									{formatCurrency(Number(shippingMethod.price))}</span
								>
							</Label>
						</div>
					{/each}
					<RadioGroup.Input name="spacing" />
				</RadioGroup.Root>
			{:else}
				<GuestContact bind:this={contactForm} customer={data?.activeOrder?.customer} />

				<GuestShippingInformation
					bind:this={shippingForm}
					address={data?.activeOrder?.shippingAddress}
				/>
				<RadioGroup.Root bind:value={shippingMethodId} class="gap-5 md:gap-10">
					{#each data.shippingMethods ?? [] as shippingMethod}
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value={shippingMethod.id} id={shippingMethod.id} />
							<Label for={shippingMethod.id}>
								{shippingMethod.name}
								<span class="text-muted-foreground">
									{formatCurrency(Number(shippingMethod.price))}</span
								>
							</Label>
						</div>
					{/each}
					<RadioGroup.Input name="spacing" />
				</RadioGroup.Root>
			{/if}

			<div class="flex h-[auto] w-full flex-col gap-4 py-4 lg:max-w-[600px]">
				<h4 class="font-display text-lg font-semibold tracking-wide md:text-2xl lg:text-3xl">
					Selected items
				</h4>

				<OrderList />
				<div>
					<Button variant="secondary" href="/search">Add more items</Button>
				</div>
			</div>
		</div>

		<div class="relative z-10 mb-5 w-full lg:mt-[-7.5rem] lg:max-w-[400px]">
			<div class="left-0 top-[6rem] flex w-full flex-col lg:sticky">
				<div
					class="flex flex-col gap-4 rounded-2xl border border-[#2021251f] bg-card p-3 lg:p-[1.5rem] lg:shadow-lg"
				>
					<div class="flex items-center justify-between">
						<p class="text-lg font-semibold lg:text-2xl">Prices incl. taxes</p>
					</div>
					<ul class="flex flex-col gap-3 border-b pb-5 pt-2">
						<li class="flex items-center justify-between">
							<p class="text-sm font-medium lg:text-base">
								Item subtotal ({activeOrder?.lines?.length || 0} item)
							</p>
							<span
								class="rounded-md bg-primary/20 px-2 py-1 text-sm font-medium text-primary lg:text-base"
							>
								{formatCurrency(activeOrder?.subTotalWithTax, activeOrder?.currencyCode)}
							</span>
						</li>
						<li class="flex items-center justify-between">
							<p class="text-sm font-medium lg:text-base">Delivery ({shippingMethod?.name})</p>
							<span
								class="rounded-md bg-primary/20 px-2 py-1 text-sm font-medium text-primary lg:text-base"
							>
								{formatCurrency(Number(shippingMethod?.price), activeOrder?.currencyCode)}
							</span>
						</li>
					</ul>
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium lg:text-base">Total</p>
						<span
							class="rounded-md bg-primary/20 px-2 py-1 text-sm font-medium text-primary lg:text-base"
						>
							{formatCurrency(
								(activeOrder?.subTotalWithTax || 0) + (Number(shippingMethod?.price) || 0),
								activeOrder?.currencyCode
							)}
						</span>
					</div>
					<Button
						on:click={async () => {
							checkOut();
						}}
						class="w-full"
					>
						{#if loading}
							<Loader2 class="h-6 w-6 animate-spin " />
						{:else}
							Proceed To Make Payment
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</section>
</main>
