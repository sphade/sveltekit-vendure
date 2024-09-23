<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '../ui/button';
	import Input from '../ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';
	import { updateEmailSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import { confirmEmailModalStore } from '$lib/stores/modalStore';
	import { requestEmailUpdate } from '$lib/mutation';
	let modalState = false;
	const form = superForm(defaults(zod(updateEmailSchema)), {
		validators: zod(updateEmailSchema),
		SPA: true,
		resetForm: true,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const { data, errors } = await requestEmailUpdate.mutate({
					newEmail: form.data.email,
					password: form.data.password
				});

				if (errors) {
					toast.error(errors[0].message);
					return;
				}
				const result = data?.requestUpdateCustomerEmailAddress;
				switch (result?.__typename) {
					case 'Success':
						toast.success('Email updated successfully');
						modalState = false;
						confirmEmailModalStore.setTrue();
						break;
					case "non-exhaustive; don't match this":
						toast.error('an error occurred');
						break;
					default:
						toast.error('an error occurred');
				}
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root bind:open={modalState}>
	<Dialog.Trigger class={buttonVariants({ variant: 'link' })}>Change Email</Dialog.Trigger>
	<Dialog.Content class="w-full p-3 sm:p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-3xl ">Change Email</Dialog.Title>
		</Dialog.Header>
		<form method="post" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>This is your new email.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.Description>This is your password.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="w-full shadow-md mt-2"
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Update Email
				{/if}</Form.Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
