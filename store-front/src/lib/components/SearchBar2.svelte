<script>
	import { Search } from 'lucide-svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';

	const query = queryParam('term', ssp.string(), { debounceHistory: 1000 });
</script>

<form
	class="bg-muted rounded-3xl w-full flex focus-within:ring-2 focus-within:ring-primary px-3.5 items-center justify-between"
>
	<input
		type="text"
		placeholder="search.."
		class="bg-transparent placeholder:text-muted-foreground flex-1 h-11 outline-none"
		name=""
		id=""
		bind:value={$query}
	/>
	<Search class="text-muted-foreground" />
</form>
