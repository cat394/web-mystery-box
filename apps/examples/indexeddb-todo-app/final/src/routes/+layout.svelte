<script lang="ts">
	import '../app.css';
	import 'iconify-icon';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="global-layout text-bg-primary">
	<header>
		<h1>Todo app</h1>
	</header>
	<nav>
		<h1>Pages</h1>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/categories">Categories</a>
			</li>
		</ul>
	</nav>
	<main class="text-bg-secondary">
		{@render children()}
	</main>
	<footer>
		<small>This app is made by <a href="https://github.com/cat394">Kokomi</a></small>
	</footer>
</div>

<style>
	.global-layout {
		min-height: 100dvh;
		display: grid;
		grid-template:
			'header header' auto
			'nav main' 1fr
			'nav footer' auto / auto 1fr;
	}
	header,
	nav,
	main,
	footer {
		padding: 1em;
	}
	header {
		grid-area: header;
		text-align: center;
	}
	nav {
		grid-area: nav;
	}
	main {
		grid-area: main;
	}
	footer {
		grid-area: footer;
		text-align: center;
	}
	ul {
		display: grid;
		gap: 1em;
		margin-block-start: 2rem;

		li > a {
			font-size: var(--text-md);
			font-weight: bold;
		}
	}
</style>
