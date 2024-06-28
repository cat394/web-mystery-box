<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { TodoStore, type Todo, type Category } from '$lib/store';
	import { Table } from '$lib/components';
	import { getTodoAppDB } from '$lib/store';

	const categoryId = $page.params.categoryId;

	let categoryName: string | undefined = $state();
	let todoStore: TodoStore | undefined = $state();

	onMount(async () => {
		const dbHelper = await getTodoAppDB();
		const transaction = dbHelper.transaction(['todos', 'categories']);

		async function findCategoryName() {
			const storeHelper = transaction.objectStore<Category>('categories');
			categoryName = (await storeHelper.get(categoryId)).name;
		}

		async function getCategoryTodos() {
			const range = IDBKeyRange.only(categoryId);
			const todos = await transaction
				.objectStore<Todo>('todos')
				.index<'todos'>('category')
				.getAll(range);
			todoStore = new TodoStore(dbHelper, todos);
		}

		await Promise.all([findCategoryName(), getCategoryTodos()]);
	});
</script>

{#if categoryName}
	<h1>Category: {categoryName}</h1>
{/if}

{#if todoStore}
	<Table dataObjects={todoStore.store.todos} />
{/if}
