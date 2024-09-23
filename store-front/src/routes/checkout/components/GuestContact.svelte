<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { guestInformationSchema } from '$lib/schema';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	export let customer: any;
	export const form = superForm(
		defaults({ ...customer, email: customer?.emailAddress }, zod(guestInformationSchema)),
		{
			validators: zod(guestInformationSchema),
			SPA: true,
			resetForm: false
		}
	);
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<p class="mb-10 text-lg font-medium capitalize text-muted-foreground">Contact information</p>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email <span class="font-bold text-red-500">*</span></Form.Label>

			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex items-center justify-between gap-5">
		<Form.Field {form} name="firstName" class="w-full">
			<Form.Control let:attrs>
				<Form.Label>First name <span class="font-bold text-red-500">*</span></Form.Label>

				<Input {...attrs} bind:value={$formData.firstName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName" class="w-full">
			<Form.Control let:attrs>
				<Form.Label>Last name <span class="font-bold text-red-500">*</span></Form.Label>

				<Input {...attrs} bind:value={$formData.lastName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
</form>
