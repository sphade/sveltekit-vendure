<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { loginModalStore, mobileAuthStore, registerModalStore } from '$lib/stores/modalStore';

	import Button from '../ui/button/button.svelte';
</script>

<Dialog.Root open={$mobileAuthStore} onOpenChange={mobileAuthStore.toggleModal}>
	<Dialog.Content class="w-full p-5">
		<Dialog.Header class="mt-10">
		</Dialog.Header>
		<Button
			on:click={() => {
				mobileAuthStore.setFalse();
				loginModalStore.setTrue();
			}}
			variant="secondary">Login</Button
		>
		<Button
			on:click={() => {
				mobileAuthStore.setFalse();
				registerModalStore.setTrue();
			}}>Register</Button
		>
	</Dialog.Content>
</Dialog.Root>
