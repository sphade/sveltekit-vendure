<script lang="ts">
	import { page } from '$app/stores';
	import { addressSchema } from '$lib/schema.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Loader2 } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { editAddress } from '$lib/mutation/index.js';

	export let data;

	let form = superForm(data.form, {
		validators: zodClient(addressSchema),
		SPA: true,
		dataType: 'json',
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
				const { data } = await editAddress.mutate({
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
						defaultShippingAddress: isDefaultShipping,
						id: $page.params.id
					}
				});

				toast.success('address updated successfully');
				goto('/me/addresses', {
					invalidateAll: true
				});
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full max-w-lg p-5 sm:p-10">
	<div>
		<h1 class="font-display mb-10 font-medium md:text-xl">Edit Your Address details</h1>
	</div>
	<form method="POST" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Full name <span class="font-bold text-red-500">*</span></Form.Label>

				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="address">
			<Form.Control let:attrs>
				<Form.Label>Address <span class="font-bold text-red-500">*</span></Form.Label>
				<Input {...attrs} bind:value={$formData.address} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="apartment">
			<Form.Control let:attrs>
				<Form.Label>Apartment, suites, etc</Form.Label>
				<Input {...attrs} bind:value={$formData.apartment} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-4">
			<Form.Field {form} name="postalCode" class="col-span-1">
				<Form.Control let:attrs>
					<Form.Label>Postal code <span class="font-bold text-red-500">*</span></Form.Label>
					<Input {...attrs} bind:value={$formData.postalCode} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} class="col-span-3" name="city">
				<Form.Control let:attrs>
					<Form.Label>City <span class="font-bold text-red-500">*</span></Form.Label>
					<Input {...attrs} bind:value={$formData.city} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Field {form} name="state">
			<Form.Control let:attrs>
				<Form.Label>State / Province</Form.Label>
				<Input {...attrs} bind:value={$formData.state} />
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
					{#each data.countries ?? [] as { name, code, id }}
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
		<Form.Button class="w-full shadow-md" size="lg">
			{#if $delayed}
				<Loader2 class="size-6 animate-spin " />
			{:else}
				Edit address
			{/if}
		</Form.Button>
	</form>
</div>
