<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		'inline-flex h-10 items-center justify-center rounded-md  p-1 text-[#8C8C8C]',
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
