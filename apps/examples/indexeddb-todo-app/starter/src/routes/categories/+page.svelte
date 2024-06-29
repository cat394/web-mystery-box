<!-- <script lang="ts">
	import { getTodoAppDB } from '$lib/store/setting/db';
	import { isEmpty } from '$lib/utils';
	import { onMount } from 'svelte';
	import { CategoryStore, type Category } from '$lib/store';
	import { PageContainer } from '$lib/components';

	let categoryStore = $state<CategoryStore | undefined>();
	let creatingCategory = $state<boolean>(false);

	onMount(async () => {
		const todoAppDB = await getTodoAppDB();
		const transaction = todoAppDB.transaction(['todos']);

		async function makeCategoriessStore() {
			const todosObjectStore = transaction.objectStore<Category>('todos');
			const allCategories = await todosObjectStore.getAll();
			categoryStore = new CategoryStore(todoAppDB, allCategories);
		}

		await makeCategoriessStore();
	});

	async function handleAddCategorySubmit(event: SubmitEvent) {
		if (!categoryStore) return;

		event.preventDefault();

		creatingCategory = true;

		const form = event.target as HTMLFormElement;

		const formData = new FormData(form);

		const categoryName = formData.get('todo') as string;

		if (!categoryName) return;

		await categoryStore.add({ name: categoryName });

		form.reset();

		creatingCategory = false;
	}
</script>

<PageContainer title="categories">
	{#snippet leftContent()}
		<section>
			<form onsubmit={handleAddCategorySubmit}>
				<fieldset disabled={creatingCategory}>
					<legend>Create your category!</legend>
					<label>
						<span class="label-text">Category name:</span>
						<input type="text" name="todo" required autocomplete="off" />
					</label>
					<button class="primary-btn">Add category</button>
				</fieldset>
			</form>
		</section>
	{/snippet}
	{#snippet rightContent()}
		<section>
			{#if categoryStore && !isEmpty(categoryStore.store.categories)}
				<h2>Your categories</h2>
				<ul>
					{#each categoryStore.store.categories as category}
						<li>
							<a href="/categories/{category.id}">{category.name}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/snippet}
</PageContainer>

<style>
	ul {
		display: flex;
		gap: 1rem;
		list-style: none;
		margin-inline-start: var(--shift-size-sm);
	}
	label {
		margin-block-end: 1.2rem;
	}
</style> -->
