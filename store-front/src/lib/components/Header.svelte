<script lang="ts">
	import Button from './ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { ChevronDown, Menu, ShoppingCart } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import type { User$result } from '$houdini';
	import {
		cartSheetStore,
		loginModalStore,
		mobileAuthStore,
		registerModalStore
	} from '$lib/stores/modalStore';
	import LoginModal from './modals/LoginModal.svelte';
	import RegisterModal from './modals/RegisterModal.svelte';
	import ConfirmEmailModal from './modals/ConfirmEmailModal.svelte';
	import { logout } from '$lib/mutation';
	import ResetPasswordModal from './modals/ResetPasswordModal.svelte';
	import CartSheet from './modals/CartSheet.svelte';
	import MobileAuth from './modals/MobileAuth.svelte';

	export let user: User$result | null;
	export let activeOrder: any;

	function getUserInitial(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('');
	}
</script>

<header
	class={cn(
		'sticky left-0 top-0 z-50 flex items-center justify-between border bg-background px-3 py-3 md:px-10'
	)}
>
	<a href="/" class="text-2xl capitalize">
		<span class="font-bold text-primary">Svelte</span>
		store front</a
	>

	<div class="flex items-center gap-2 md:gap-6">
		{#if user?.activeCustomer}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button class="flex items-center gap-3 rounded-3xl border border-border bg-muted p-1">
						<Avatar.Root class="ring ring-primary">
							<Avatar.Image
								src={user?.activeCustomer?.firstName}
								alt="{user?.activeCustomer?.firstName} profile picture"
							/>
							<Avatar.Fallback class="capitalize"
								>{getUserInitial(user?.activeCustomer?.firstName || '')}</Avatar.Fallback
							>
						</Avatar.Root>

						<ChevronDown />
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/me/personal-info">Profile</DropdownMenu.Item>
						<DropdownMenu.Item href="/me/order-history">Order history</DropdownMenu.Item>
						<DropdownMenu.Item href="/me/redeem-code">Redeem code</DropdownMenu.Item>
						<DropdownMenu.Item href="/me/addresses">Addresses</DropdownMenu.Item>
						<DropdownMenu.Item href="/me/settings">Settings</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />

					<DropdownMenu.Separator />

					<DropdownMenu.Item
						on:click={async () => {
							await logout.mutate(null);
							invalidateAll();
						}}>Log out</DropdownMenu.Item
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<div class="hidden items-center gap-2 md:flex">
				<Button on:click={loginModalStore.setTrue} variant="ghost">Login</Button>
				<Button on:click={registerModalStore.setTrue}>Register</Button>
			</div>

			<button
				on:click={() => {
					mobileAuthStore.setTrue();
				}}
				class="flex size-10 items-center justify-center rounded-full hover:bg-secondary md:hidden"
			>
				<Menu class="size-6 " />
			</button>
		{/if}
		{#if activeOrder?.lines?.length}
			<button on:click={() => cartSheetStore.setTrue()} class="relative inline-block h-fit w-fit">
				<div
					class="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-white"
				>
					{activeOrder?.lines?.length || 0}
				</div>
				<ShoppingCart class="h-6 w-6" />
			</button>
		{/if}
	</div>
</header>

<LoginModal />
<RegisterModal />
<ConfirmEmailModal />
<ResetPasswordModal />
<CartSheet />
<MobileAuth />
