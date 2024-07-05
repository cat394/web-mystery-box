<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		leftContent: Snippet;
		rightContent: Snippet;
	};
	let { title, leftContent, rightContent }: Props = $props();
</script>

<div class="page-container">
	<h1>{title}</h1>
	<section class="left">
		{@render leftContent()}
	</section>
	<hr class="divider-inline sm" />
	<section class="right">
		{@render rightContent()}
	</section>
</div>

<style>
	.page-container {
		height: 100%;
		display: grid;
		grid-template:
			'header header header' auto
			'left divider right' 1fr / auto auto 1fr;
	}
	h1 {
		text-transform: capitalize;
	}
	.left {
		grid-area: left;
	}
	hr {
		grid-area: divider;
	}
	.right {
		grid-area: right;
	}
</style>
