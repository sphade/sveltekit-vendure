<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import UpdateEmailModal from '$lib/components/modals/UpdateEmailModal.svelte';
	import UpdateNameModal from '$lib/components/modals/UpdateNameModal.svelte';
	import UpdateNumberModal from '$lib/components/modals/UpdateNumberModal.svelte';
	import UpdatePasswordModal from '$lib/components/modals/UpdatePasswordModal.svelte';
	import { Button } from '$lib/components/ui/button';
	import { logout } from '$lib/mutation';
</script>

<div class="m-auto flex w-full max-w-[900px] flex-col gap-5 px-2 md:px-10">
	<div class="flex w-full justify-between gap-5 border-b pb-3">
		<p class="text-base font-semibold md:text-lg">Email</p>
		<UpdateEmailModal />
	</div>

	<div class="flex w-full justify-between gap-5 border-b pb-3">
		<p class="text-base font-semibold md:text-lg">Mobile number</p>
		<UpdateNumberModal />
	</div>

	<div class="flex w-full justify-between gap-5 border-b pb-3">
		<p class="text-base font-semibold md:text-lg">Name</p>
		<UpdateNameModal />
	</div>
	<div class="flex w-full justify-between gap-5 border-b pb-3">
		<p class="text-base font-semibold md:text-lg">Password</p>

		<UpdatePasswordModal />
	</div>

	<div class="flex w-full justify-between gap-5 border-b pb-3">
		<p class="text-base font-semibold md:text-lg">Log out african market online</p>
		<Button
			on:click={async () => {
				await logout.mutate(null);
				invalidateAll();
				// goto('/');
			}}
			variant="link">Logout</Button
		>
	</div>
</div>
