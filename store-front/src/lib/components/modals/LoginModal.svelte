<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { loginSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import { Input } from '../ui/input';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { graphql, LoginStore } from '$houdini';
	import { loginModalStore, requestPasswordResetModalStore } from '$lib/stores/modalStore';
	const login: LoginStore = graphql`
		mutation Login($email: String!, $password: String!) {
			login(username: $email, password: $password, rememberMe: true) {
				... on CurrentUser {
					id

					channels {
						id
					}
				}
				... on ErrorResult {
					errorCode
					message
				}

				__typename
			}
		}
	`;

	const form = superForm(defaults(zod(loginSchema)), {
		validators: zod(loginSchema),
		SPA: true,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				const { email, password } = form.data;
				const { data, errors } = await login.mutate({ email, password });
				switch (data?.login.__typename) {
					case 'CurrentUser':
						// reset();
						toast.success('Login successful');
						// invalidateAll();
						loginModalStore.setFalse();
						if (
							$page.url.pathname === '/verify-email' ||
							$page.url.pathname === '/password-reset'
						) {
							goto('/', {
								invalidateAll: true
							});
						}

						break;
					case 'InvalidCredentialsError':
					case 'NativeAuthStrategyError':
					case 'NotVerifiedError':
						toast.error(data.login.message);

					default:
						break;
				}
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root open={$loginModalStore} onOpenChange={loginModalStore.toggleModal}>
	<Dialog.Content class="w-full p-5">
		<Dialog.Header class="mt-10">
			<Dialog.Title class="font-display text-3xl ">Log in to your account</Dialog.Title>
			<Dialog.Description>
				Enter your email and password to log in. Click login when you're ready.
			</Dialog.Description>
		</Dialog.Header>
		<form method="post" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>This is your email.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} bind:value={$formData.password} type="password" />
				</Form.Control>
				<Form.Description>Input your password here</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<button
				on:click={() => {
					loginModalStore.setFalse();
					requestPasswordResetModalStore.setTrue();
				}}
				class="text-sm text-primary"
				type="button">Forgot Your password?</button
			>
			<Form.Button class="mt-2 w-full" type="submit"
				>{#if $delayed}
					<Loader2 class="size-6 animate-spin " />
				{:else}
					Login
				{/if}</Form.Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
