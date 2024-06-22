<script lang="ts">
	import { getTodoAppDBHelper, getTodoAppDBObjectStoreHelperFactory } from '$lib/store/setting/db';
	import { isEmpty } from '$lib/utils';
	import { onMount } from 'svelte';
	import { type Category, type CategoryStore, createCategoryStore } from '$lib/store';
	import PageContainer from '$lib/components/PageContainer.svelte';

	let categoryStore = $state<CategoryStore | undefined>();
	let creatingCategory = $state<boolean>(false);

	onMount(async () => {
		const dbHelper = await getTodoAppDBHelper();
		const todosAppObjectStoreHelper = getTodoAppDBObjectStoreHelperFactory(dbHelper);

		async function makeCategoriessStore() {
			const categoriesObjectStoreHelper = todosAppObjectStoreHelper<Category>('categories');
			const allCategories = await categoriesObjectStoreHelper.getAll();
			categoryStore = createCategoryStore(allCategories, categoriesObjectStoreHelper);
		}

		await makeCategoriessStore();
	});

	function changeCreatingCategoryState() {
		creatingCategory = !creatingCategory;
	}

	async function handleAddCategorySubmit(event: SubmitEvent) {
		if (!categoryStore) return;

		event.preventDefault();

		changeCreatingCategoryState();

		const form = event.target as HTMLFormElement;

		const formData = new FormData(form);

		const categoryName = formData.get('todo') as string;

		if (!categoryName) return;

		await categoryStore.add({ name: categoryName });

		form.reset();

		changeCreatingCategoryState();
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
</style>
