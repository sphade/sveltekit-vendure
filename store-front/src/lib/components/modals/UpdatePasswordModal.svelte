<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '../ui/button';
	import Input from '../ui/input/input.svelte';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { updatePasswordSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updatePassword } from '$lib/mutation';
	let modalState = false;
	const form = superForm(defaults(zod(updatePasswordSchema)), {
		validators: zod(updatePasswordSchema),
		SPA: true,
		resetForm: true,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const { data, errors } = await updatePassword.mutate({
					currentPassword: form.data.currentPassword,
					newPassword: form.data.newPassword
				});
				if (errors) {
					toast.error(errors[0].message);
					return;
				}
				const result = data?.updateCustomerPassword;
				switch (result?.__typename) {
					case 'Success':
						toast.success('Password updated successfully');
						modalState = false;
						break;
					case 'InvalidCredentialsError':
					case 'NativeAuthStrategyError':
					case 'PasswordValidationError':
						toast.error(result.message);
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
	<Dialog.Trigger class={buttonVariants({ variant: 'link' })}>Change Password</Dialog.Trigger>
	<Dialog.Content class="w-full p-3 sm:p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-3xl ">Change Password</Dialog.Title>
		</Dialog.Header>
		<form method="post" use:enhance>
			<Form.Field {form} name="currentPassword">
				<Form.Control let:attrs>
					<Form.Label>Current Password</Form.Label>
					<Input type="password" {...attrs} bind:value={$formData.currentPassword} />
				</Form.Control>
				<Form.Description>Your current password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="newPassword">
				<Form.Control let:attrs>
					<Form.Label>New Password</Form.Label>

					<Input type="password" {...attrs} bind:value={$formData.newPassword} />
				</Form.Control>
				<Form.Description>Your new password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmNewPassword">
				<Form.Control let:attrs>
					<Form.Label>Confirm New Password</Form.Label>

					<Input type="password" {...attrs} bind:value={$formData.confirmNewPassword} />
				</Form.Control>
				<Form.Description>Confirm your new password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="mt-2 w-full"
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Change Password
				{/if}</Form.Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
