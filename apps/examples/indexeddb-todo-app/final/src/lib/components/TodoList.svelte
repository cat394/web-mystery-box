<script lang="ts">
	import type { Todo, TodoStore, CategoryStore } from '$lib/store';
	import { flip } from 'svelte/animate';
	import { send, receive } from '$lib/animations/transition';

	type Props = {
		store: TodoStore;
		todos: Todo[];
		header: string;
	};

	let { store, todos, header }: Props = $props();
</script>

<section>
	<h2>{header}</h2>
	<ul data-testid={header}>
		{#each todos as { id, completed, todo } ({ id })}
			<li animate:flip={{ duration: 200 }} in:receive={{ key: id }} out:send={{ key: id }}>
				<div class="todo-checkable-area">
					<label>
						<span class="sr-only">{completed ? 'Todo is remaining' : 'Todo is completed'}</span>
						<input
							type="checkbox"
							checked={completed}
							onchange={async () => await store.update(id, { completed: !completed })}
						/>
					</label>
					<p>{todo}</p>
				</div>
				<button class="trash-btn border-rounded" onclick={async () => await store.remove(id)}>
					<span class="sr-only">Remove todo</span>
					<iconify-icon icon="iconoir:trash-solid"></iconify-icon>
				</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	h2 {
		margin-block-end: 1rem;
	}
	ul {
		display: grid;
		row-gap: 1.3rem;
	}
	li {
		/* layout */
		width: fit-content;
		display: flex;
		align-items: center;
		padding: 0.3rem 1rem;
		border-radius: 0.5rem;
		box-shadow: 0px 0px 10px 3px var(--accent-primary);

		/* text */
		font-size: var(--text-sm);
		color: var(--white);
	}
	p {
		padding-inline: 2em;
	}
	.trash-btn {
		/* layout */
		display: flex;
		align-items: center;
		padding: 0.63rem;

		/* effect */
		transition: all 300ms;

		&:hover {
			color: var(--text-primary);
			background-color: var(--accent-secondary);
		}
	}
	.todo-checkable-area {
		position: relative;
		flex-grow: 1;

		label {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;

			/* Cover area */
			position: absolute;
			inset: 0;
			z-index: 1;
			cursor: pointer;
		}
	}
</style>
