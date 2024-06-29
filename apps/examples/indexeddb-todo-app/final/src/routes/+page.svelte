<script lang="ts">
	import { onMount } from 'svelte';
	import { getTodoAppDB, TodoStore, type Todo, type Category } from '$lib/store';
	import { TodoList, PageContainer } from '$lib/components';
	import { isEmpty } from '$lib/utils';

	let todoStore = $state<TodoStore | undefined>();
	let categories = $state<Category[] | undefined>();

	let creatingTodo: boolean = $state(false);

	onMount(async () => {
		const todoAppDB = await getTodoAppDB();
		const transaction = todoAppDB.transaction(['todos', 'categories']);

		async function makeTodosStore() {
			const objectStore = transaction.objectStore<Todo>('todos');

			const allTodos = await objectStore.getAll();

			todoStore = new TodoStore(todoAppDB, allTodos);
		}

		async function getCategories() {
			const objectStore = transaction.objectStore<Category>('categories');

			categories = await objectStore.getAll();
		}

		await Promise.all([makeTodosStore(), getCategories()]);
	});

	async function handleAddTodoSubmit(event: SubmitEvent) {
		if (!todoStore) return;

		creatingTodo = true;

		event.preventDefault();

		const form = event.target as HTMLFormElement;

		const formData = new FormData(form);

		const todo = formData.get('todo') as string;

		const categoryIds = formData.getAll('category') as string[];

		if (!todo) return;

		await todoStore.add({ todo, categoryIds });

		form.reset();

		creatingTodo = false;
	}
</script>

<PageContainer title="home">
	{#snippet leftContent()}
		<form onsubmit={handleAddTodoSubmit}>
			<fieldset disabled={creatingTodo}>
				<legend>Make your todo!</legend>
				<label>
					<span class="label-text">Todo:</span>
					<input type="text" name="todo" required autocomplete="off" />
				</label>
				{#if categories && !isEmpty(categories)}
					<label>
						<span class="label-text">Category:</span>
						<ul>
							{#each categories as category}
								<li>
									<label>
										<input type="checkbox" name="category" value={category.id} />
										{category.name}
									</label>
								</li>
							{/each}
						</ul>
					</label>
				{/if}
				<button class="primary-btn" type="submit">Add todo</button>
			</fieldset>
		</form>
	{/snippet}
	{#snippet rightContent()}
		<section>
			<h2>Todos</h2>
			<div class="todos-container">
				{#if todoStore}
					<div class="remaining">
						<TodoList
							store={todoStore}
							todos={todoStore.store.remaining}
							header="Remaining:"
							labelMessage="Todo is completed!"
						/>
					</div>
					<div class="finished">
						<TodoList
							store={todoStore}
							todos={todoStore.store.finished}
							header="Finished:"
							labelMessage="Todo is remaining!"
						/>
					</div>
				{/if}
			</div>
		</section>
	{/snippet}
</PageContainer>

<style>
	.todos-container {
		--gap: 1rem;
		--half-gap: calc(var(--gap) / 2);
		--content-base-size: 50%;
		--content-size: calc(var(--content-base-size) - var(--half-gap));

		display: grid;
		grid-template: 'remaining finished' 1fr / var(--content-size) var(--content-size);
		column-gap: var(--gap);

		.remaining {
			grid-area: remaining;
		}

		.finished {
			grid-area: finished;
		}
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 1.2rem;

		label {
			width: fit-content;
		}
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.8em;
	}
</style>
