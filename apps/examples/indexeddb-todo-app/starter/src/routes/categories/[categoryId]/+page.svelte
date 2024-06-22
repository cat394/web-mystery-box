<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Category } from '$lib/store/categories.svelte';
	import { type Todo, type Todos, createTodosStore } from '$lib/store/todos.svelte';
	import { Table } from '$lib/components';
	import {
		getTodoAppDBHelper,
		getTodoAppDBObjectStoreHelper,
		getTodosAppDBObjectStoreIndexHelper
	} from '$lib/store';

	let categoryName: string | undefined = $state();
	let todosStore: Todos | undefined = $state();

	onMount(async () => {
		const dbHelper = await getTodoAppDBHelper();
		const todosAppObjectStoreHelper = getTodoAppDBObjectStoreHelper(dbHelper);
		const categoryId = $page.params.categoryId;

		async function findCategoryName() {
			const categoriesObjectStoreHelper = todosAppObjectStoreHelper<Category>('categories');
			categoryName = (await categoriesObjectStoreHelper.get(categoryId)).name;
		}

		async function getCategoryTodos() {
			const todosObjectStoreHelper = todosAppObjectStoreHelper<Todo>('todos');
			const todosHelper = getTodosAppDBObjectStoreIndexHelper<Todo>(
				todosObjectStoreHelper,
				'category'
			);
			const todos = await todosHelper.getAll(categoryId);
			todosStore = createTodosStore(todos, todosObjectStoreHelper);
		}

		await Promise.all([findCategoryName(), getCategoryTodos()]);
	});
</script>

{#if categoryName}
	<h1>Category: {categoryName}</h1>
{/if}

{#if todosStore}
	<Table dataObjects={todosStore.store.todos} />
{/if}
