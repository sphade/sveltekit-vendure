<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '../ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Loader2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addressSchema } from '$lib/schema';
	import Input from '../ui/input/input.svelte';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { addressModalStore } from '$lib/stores/modalStore';
	import { addAddress } from '$lib/mutation';

	let formElement: HTMLFormElement;
	const form = superForm(defaults(zod(addressSchema)), {
		validators: zod(addressSchema),
		SPA: true,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const {
					address,
					apartment,
					city,
					country,
					name,
					phone,
					postalCode,
					state,
					isDefaultBilling,
					isDefaultShipping
				} = form.data;

				const { data } = await addAddress.mutate({
					input: {
						fullName: name,
						city,
						streetLine1: address,
						streetLine2: apartment,
						postalCode,
						countryCode: country,
						phoneNumber: phone,
						province: state,
						defaultBillingAddress: isDefaultBilling,
						defaultShippingAddress: isDefaultShipping
					}
				});
				toast.success('address updated successfully');
				addressModalStore.setFalse();
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
	let countries = $page.data.countries;
</script>

<Dialog.Root open={$addressModalStore} onOpenChange={addressModalStore.toggleModal}>
	<Dialog.Trigger class={buttonVariants()}>Add a new address</Dialog.Trigger>
	<Dialog.Content class="w-full p-5 sm:p-10 ">
		<Dialog.Header>
			<Dialog.Title class="font-display font-medium md:text-xl">Add Address</Dialog.Title>
		</Dialog.Header>

		<form method="POST" bind:this={formElement} use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Label <span class="font-bold text-red-500">*</span></Form.Label>

					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="address">
				<Form.Control let:attrs>
					<Form.Label>Address <span class="font-bold text-red-500">*</span></Form.Label>
					<Input {...attrs} autocomplete="shipping address-line1" bind:value={$formData.address} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="apartment">
				<Form.Control let:attrs>
					<Form.Label>Apartment, suites, etc</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.apartment}
						autocomplete="shipping address-line2"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-4 gap-2">
				<Form.Field {form} name="postalCode" class="col-span-1">
					<Form.Control let:attrs>
						<Form.Label>Postal code <span class="font-bold text-red-500">*</span></Form.Label>
						<Input
							{...attrs}
							autocomplete="shipping postal-code"
							bind:value={$formData.postalCode}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} class="col-span-3" name="city">
					<Form.Control let:attrs>
						<Form.Label>City <span class="font-bold text-red-500">*</span></Form.Label>
						<Input {...attrs} bind:value={$formData.city} autocomplete="shipping address-level2" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="state">
				<Form.Control let:attrs>
					<Form.Label>State / Province</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.state}
						autocomplete="shipping address address-level1"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="country">
				<Form.Control let:attrs>
					<Form.Label>Country <span class="font-bold text-red-500">*</span></Form.Label>
					<select
						{...attrs}
						class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						bind:value={$formData.country}
						autocomplete="address country"
					>
						<option value="" disabled selected>Select a country</option>
						{#each countries as { name, code, id }}
							<option value={code}>{name}</option>
						{/each}
					</select>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Phone</Form.Label>
					<Input {...attrs} bind:value={$formData.phone} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field
				{form}
				name="isDefaultShipping"
				class="flex flex-row items-start space-x-3 space-y-0  p-4"
			>
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.isDefaultShipping} />
					<div class="space-y-1 leading-none">
						<Form.Label>Use as default shipping address</Form.Label>
					</div>
					<input name={attrs.name} value={$formData.isDefaultShipping} hidden />
				</Form.Control>
			</Form.Field>

			<Form.Field
				{form}
				name="isDefaultBilling"
				class="flex flex-row items-start space-x-3 space-y-0  p-4"
			>
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.isDefaultBilling} />
					<div class="space-y-1 leading-none">
						<Form.Label>Use as default Billing address</Form.Label>
					</div>
					<input name={attrs.name} value={$formData.isDefaultBilling} hidden />
				</Form.Control>
			</Form.Field>
			<Form.Button type="submit" class="w-full shadow-md" size="lg">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Add address
				{/if}
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
