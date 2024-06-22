import { crossfade } from 'svelte/transition';
import { quartOut, sineInOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 760),

	easing: sineInOut,

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 800,
			easing: quartOut,
			css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
});