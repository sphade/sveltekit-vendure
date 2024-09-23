<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '../ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';
	import { requestPasswordResetSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import { confirmEmailModalStore, requestPasswordResetModalStore } from '$lib/stores/modalStore';
	import { requestPasswordReset } from '$lib/mutation';
	const form = superForm(defaults(zod(requestPasswordResetSchema)), {
		validators: zod(requestPasswordResetSchema),
		SPA: true,
		resetForm: true,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const { data, errors } = await requestPasswordReset.mutate({
					emailAddress: form.data.email
				});

				if (errors) {
					toast.error(errors[0].message);
					return;
				}
				const result = data?.requestPasswordReset;
				switch (result?.__typename) {
					case 'Success':
						requestPasswordResetModalStore.setFalse();
						confirmEmailModalStore.setTrue();
						break;
					case 'NativeAuthStrategyError':
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

<Dialog.Root
	open={$requestPasswordResetModalStore}
	onOpenChange={requestPasswordResetModalStore.toggleModal}
>
	<Dialog.Content class="w-full p-3 sm:p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-3xl ">Request to reset your password</Dialog.Title>
		</Dialog.Header>
		<form method="post" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>place in your email</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="mt-2 w-full shadow-md"
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Request password reset
				{/if}</Form.Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
