<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const categoryId = $page.params.categoryId;

	onMount(async () => {
		async function findCategoryName() {}

		async function getCategoryTodos() {}

		await Promise.all([findCategoryName(), getCategoryTodos()]);
	});
</script>

<!-- {#if categoryName}
	<h1>Category: {categoryName}</h1>
{/if}

{#if todosStore}
	<Table dataObjects={todosStore.store.todos} />
{/if} -->
