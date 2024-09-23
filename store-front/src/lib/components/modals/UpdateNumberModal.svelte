<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '../ui/button';
	import Input from '../ui/input/input.svelte';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { Loader2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateNumberSchema } from '$lib/schema';
	import { toast } from 'svelte-sonner';
	import { updateCustomer } from '$lib/mutation';
	$: ({ user } = $page.data);

	let modalState = false;
	const form = superForm(
		defaults({ number: $page.data.user?.activeCustomer?.phoneNumber }, zod(updateNumberSchema)),
		{
			validators: zod(updateNumberSchema),
			SPA: true,
			resetForm: true,
			onUpdate: async ({ form }) => {
				if (form.valid) {
					const { data, errors } = await updateCustomer.mutate({
						input: {
							phoneNumber: form.data.number
						}
					});
					if (errors) {
						toast.error(errors[0].message);
						return;
					}
					modalState = false;
					toast.success('Phone number updated successfully');
				}
			}
		}
	);

	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root bind:open={modalState}>
	<Dialog.Trigger class={buttonVariants({ variant: 'link' })}>
		{#if user?.activeCustomer?.phoneNumber}
			{user?.activeCustomer?.phoneNumber}
		{:else}
			No number
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="w-full   p-3 sm:p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-lg sm:text-xl md:text-3xl  ">Phone number</Dialog.Title
			>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="number">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={$formData.number} />
				</Form.Control>
				<Form.Description>your phone number</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="mt-2 w-full"
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Update phone number
				{/if}</Form.Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
