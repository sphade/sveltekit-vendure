<script lang="ts">
	import { page } from '$app/stores';
	import * as Alert from '$lib/components/ui/alert';

	$: ({ user } = $page.data);

	function getUserInitial(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('');
	}
</script>

<div class="space-y-16">
	{#if !user?.activeCustomer?.lastName || !user?.activeCustomer?.firstName || !user?.activeCustomer?.phoneNumber}
		<Alert.Root variant="destructive" class="bg-red-600 text-white">
			<!-- <Terminal class="h-4 w-4" /> -->
			<Alert.Title>Profile is incomplete</Alert.Title>
			<Alert.Description>
				Kindly complete your profile update
				<a href="/me/settings" class="border-b border-b-white text-lg font-semibold md:text-lg">
					Here
				</a>
			</Alert.Description>
		</Alert.Root>
	{/if}
	<section class="flex gap-10">
		<div class="flex flex-col items-center gap-3">
			<div
				class="h-[3.75rem] w-[3.75rem] rounded-full bg-white p-1 shadow-lg md:h-[6.25rem] md:w-[6.25rem]"
			>
				<div
					class="relative flex h-full w-full items-center justify-center rounded-full bg-[#FAE9C7]"
				>
					<p class="text-2xl font-medium capitalize text-[#b6b5b1] lg:text-4xl">
						{getUserInitial(`${user?.activeCustomer?.firstName} ${user?.activeCustomer?.lastName}`)}
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-3">
			{#if !user?.activeCustomer?.firstName && !user?.activeCustomer?.lastName}
				<h1 class="font-display text-lg font-semibold md:text-2xl">No Name</h1>
			{:else}
				<h1 class="font-display text-lg font-semibold capitalize md:text-2xl">
					{user?.activeCustomer?.firstName}
					{user?.activeCustomer?.lastName}
				</h1>
			{/if}
			<div class="flex flex-col gap-3 md:flex-row md:gap-10">
				<div class="flex flex-col">
					<h2 class="text-sm font-semibold md:text-base">Email</h2>
					<p class="text-sm font-normal md:text-base">
						{user?.activeCustomer?.emailAddress}
					</p>
				</div>
				<div class="flex flex-col">
					<h2 class="text-sm font-semibold md:text-base">Phone number</h2>
					<p class="text-sm font-normal md:text-base">
						{user?.activeCustomer?.phoneNumber || 'no number'}
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
