<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import NProgress from 'nprogress';

	import { afterNavigate, beforeNavigate } from '$app/navigation';

	export let data;

	beforeNavigate(() => {
		NProgress.start();
	});
	afterNavigate(() => {
		NProgress.done();
	});
	NProgress.configure({
		showSpinner: false
	});
</script>

<Toaster />
<Header user={data.user} activeOrder={data.activeOrder} />
<slot />
