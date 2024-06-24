import type { IDBObjectStoreHelper, StoreWriteOperationResult } from '$lib/idb-helpers';
import { getId } from '$lib/utils';
import type { EssentialFields, ReturnCreateStoreFn } from './types';

export interface Category extends EssentialFields {
	name: string;
}

type ModifiableDataFields = Pick<Category, 'name'>;

export type CategoryStore = ReturnCreateStoreFn<Categories, ModifiableDataFields>;

export class Categories {
	categories = $state<Category[]>([]);

	constructor(initialCategories: Category[]) {
		this.categories = initialCategories;
	}

	add(category: Category): Category['id'] {
		this.categories.push(category);

		return category.id;
	}

	remove(id: Category['id']): Category['id'] {
		this.categories = this.categories.filter((category) => category.id !== id);
		return id;
	}

	update(id: Category['id'], updateTodo: Partial<Category>): Category['id'] {
		this.categories = this.categories.map((category) => {
			if (category.id !== id) return category;

			const merged = { ...category, ...updateTodo };

			return merged;
		});
		return id;
	}
}

export function createCategoryStore(
	initialCategories: Category[],
	categoriesObjectStoreHelper: IDBObjectStoreHelper<Category>
): CategoryStore {
	const categoriesSvelteStore = new Categories(initialCategories);

	async function add({ name }: Pick<Category, 'name'>): StoreWriteOperationResult {
		const newCategory: Category = {
			id: getId(),
			name
		};

		categoriesSvelteStore.add(newCategory);
		return await categoriesObjectStoreHelper.add(newCategory);
	}

	async function remove(id: Category['id']): StoreWriteOperationResult {
		categoriesSvelteStore.remove(id);
		return await categoriesObjectStoreHelper.remove(id);
	}

	async function update(
		id: Category['id'],
		updateInfo: Partial<Category>
	): StoreWriteOperationResult {
		categoriesSvelteStore.update(id, updateInfo);
		return await categoriesObjectStoreHelper.update(id, updateInfo);
	}

	return {
		store: categoriesSvelteStore,
		add,
		remove,
		update
	};
}
