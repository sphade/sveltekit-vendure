<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import X from 'lucide-svelte/icons/x';
	import * as Dialog from './index.js';
	import { cn, flyAndScale } from '$lib/utils.js';
	import { fly } from 'svelte/transition';

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = fly;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200,
		y: 300
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			'scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thin scrollbar-track-rounded-full  fixed bottom-0 left-0  z-50 grid h-fit   max-h-[95vh] w-full gap-4 overflow-auto rounded-t-lg border-0 bg-background shadow-lg sm:left-[50%] sm:top-[50%] sm:w-full sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg',
			className
		)}
		{...$$restProps}
	>
		<slot />

		<DialogPrimitive.Close
			class="absolute right-4 top-4 rounded-sm bg-white/20 p-2 opacity-70 ring-offset-background drop-shadow-md backdrop-blur-md transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X class="h-7 w-7 font-black text-black" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
