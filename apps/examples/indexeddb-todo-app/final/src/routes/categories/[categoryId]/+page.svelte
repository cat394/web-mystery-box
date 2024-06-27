<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { TodoStore, type Todo, type Category } from '$lib/store';
	import { Table } from '$lib/components';
	import { getTodoAppDBHelper } from '$lib/store';
	import { IDBIndexHelper, IDBObjectStoreHelper } from '$lib/idb-helpers';

	const categoryId = $page.params.categoryId;
	
	let categoryName: string | undefined = $state();
	let todoStore: TodoStore | undefined = $state();

	onMount(async () => {
		const dbHelper = await getTodoAppDBHelper();

		async function findCategoryName() {
			const storeHelper = new IDBObjectStoreHelper<Category>(dbHelper.db, 'categories');
			categoryName = (await storeHelper.get(categoryId)).name;
		}

		async function getCategoryTodos() {
			const storeHelper = new IDBObjectStoreHelper<Todo>(dbHelper.db, 'todos');
			const objectStore = storeHelper.getObjectStore();
			const indexHelper = new IDBIndexHelper<Todo>(objectStore, 'category');
			const todos = await indexHelper.getAll(categoryId);
			todoStore = new TodoStore(todos, storeHelper);
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
