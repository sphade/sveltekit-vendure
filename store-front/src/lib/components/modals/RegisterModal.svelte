<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { registerSchema } from '$lib/schema';
	import * as Form from '$lib/components/ui/form';
	import { confirmEmailModalStore, registerModalStore } from '$lib/stores/modalStore';
	import { Loader2 } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { registerUser } from '$lib/mutation';
	const form = superForm(defaults(zod(registerSchema)), {
		validators: zod(registerSchema),
		SPA: true,

		onUpdate: async ({ form }) => {
			if (form.valid) {
				try {
					await registerUser.mutate({
						input: {
							emailAddress: form.data.email,
							password: form.data.password,
							firstName: form.data.firstName,
							lastName: form.data.lastName
						}
					});

					registerModalStore.setFalse();
					confirmEmailModalStore.setTrue();
				} catch (error) {
					toast.error('an error occurred');
				}
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root open={$registerModalStore} onOpenChange={registerModalStore.toggleModal}>
	<Dialog.Content class="w-full  p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-3xl ">Create an account</Dialog.Title>
			<Dialog.Description>
				Enter your email and password to log in. Click login when you're ready.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" use:enhance>
			<div class="flex items-center gap-3">
				<Form.Field {form} name="firstName">
					<Form.Control let:attrs>
						<Form.Label>First name</Form.Label>
						<Input {...attrs} bind:value={$formData.firstName} />
					</Form.Control>
					<Form.Description>This is your public display first name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lastName">
					<Form.Control let:attrs>
						<Form.Label>Last name</Form.Label>
						<Input {...attrs} bind:value={$formData.lastName} />
					</Form.Control>
					<Form.Description>This is your public display last name.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>This is your email address</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.Description>Add your password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="confirmPassword">
				<Form.Control let:attrs>
					<Form.Label>Confirm password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.confirmPassword} />
				</Form.Control>
				<Form.Description>confirm your password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$delayed} class="mt-2 w-full">
				{#if $delayed}
					<Loader2 class="h-6 w-6 animate-spin " />
				{:else}
					Register
				{/if}
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
