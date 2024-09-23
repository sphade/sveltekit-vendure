<script lang="ts">
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { addressSchema } from '$lib/schema';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	export let address;

	export const form = superForm(
		defaults(
			{
				...address,
				name: address?.fullName,
				city: address?.city,
				address: address?.streetLine1,
				apartment: address?.streetLine2,
				postalCode: address?.postalCode,
				country: address?.countryCode,
				phone: address?.phoneNumber,
				state: address?.province
			},
			zod(addressSchema)
		),
		{
			validators: zod(addressSchema),
			SPA: true,
			resetForm: false
		}
	);

	const { form: formData, enhance, delayed } = form;

	let countries = $page.data.countries;
</script>

<div>
	<p class="mb-10 text-lg font-medium capitalize text-muted-foreground">Shipping information</p>
	<form method="POST" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Full Name <span class="font-bold text-red-500">*</span></Form.Label>

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
				<Input {...attrs} bind:value={$formData.apartment} autocomplete="shipping address-line2" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="grid grid-cols-4 gap-2">
			<Form.Field {form} name="postalCode" class="col-span-1">
				<Form.Control let:attrs>
					<Form.Label>Postal code <span class="font-bold text-red-500">*</span></Form.Label>
					<Input {...attrs} autocomplete="shipping postal-code" bind:value={$formData.postalCode} />
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
	</form>
</div>
