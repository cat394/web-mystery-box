<script lang="ts">

</script>

<!-- <PageContainer title="categories">
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
</PageContainer> -->

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
