<script lang="ts">
	import { cn } from '$lib/utils';
	export let preview: string | undefined;
	export let preset: 'tiny' | 'thumb' | 'small' | 'medium' | 'large';
	export let alt: string | undefined;
	let className: string;
	export { className as class };
</script>

<picture class={cn('inline-block ', className)}>
	<source
		class="h-full w-full object-contain"
		type="image/avif"
		srcSet={preview + `?preset=${preset}&format=avif`}
	/>
	<source
		class="h-full w-full object-contain"
		type="image/webp"
		srcSet={preview + `?preset=${preset}&format=webp`}
	/>
	<img
		class="h-full w-full rounded-lg object-contain"
		src={preview + `?preset=${preset}&format=jpg`}
		{alt}
	/>
</picture>
