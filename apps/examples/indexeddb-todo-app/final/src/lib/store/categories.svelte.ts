import type { EssentialFields, IDBObjectStoreHelper, WriteOperationResult } from '$lib/idb-helpers';
import { getId } from '$lib/utils';
import { executeOperation } from './executeOperation';
import type {
	ReturnCreateStoreFn,
	StoreMethods,
	StoreOperation,
	StoreWriteOperationResult
} from './types';

export interface Category extends EssentialFields {
	name: string;
}

type ModifiableDataFields = Omit<Category, 'id'>;

export type CategoryStore = ReturnCreateStoreFn<Categories, ModifiableDataFields>;

export class Categories implements StoreMethods<Category> {
	categories = $state<Category[]>([]);

	constructor(initialCategories: Category[]) {
		this.categories = initialCategories;
	}

	add =
		(category: Category): StoreOperation =>
		(): WriteOperationResult => {
			this.categories.push(category);

			return category.id;
		};

	remove =
		(id: Category['id']): StoreOperation =>
		(): WriteOperationResult => {
			this.categories = this.categories.filter((category) => category.id !== id);
			return id;
		};

	update =
		(id: Category['id'], updateTodo: Partial<Category>): StoreOperation =>
		(): WriteOperationResult => {
			this.categories = this.categories.map((category) => {
				if (category.id !== id) return category;

				const merged = { ...category, ...updateTodo };

				return merged;
			});
			return id;
		};
}

export function createCategoryStore(
	initialCategories: Category[],
	categoriesObjectStoreHelper: IDBObjectStoreHelper<Category>
): CategoryStore {
	const categoriesSvelteStore = new Categories(initialCategories);

	async function add({ name }: Omit<Category, 'id'>): StoreWriteOperationResult {
		let newCategory: Category = {
			id: getId(),
			name
		};

		return await executeOperation(
			categoriesSvelteStore.add(newCategory),
			categoriesObjectStoreHelper.add(newCategory)
		);
	}

	async function remove(id: Category['id']): StoreWriteOperationResult {
		return await executeOperation(
			categoriesSvelteStore.remove(id),
			categoriesObjectStoreHelper.delete(id)
		);
	}

	async function update(
		id: Category['id'],
		updateInfo: Partial<Category>
	): StoreWriteOperationResult {
		return await executeOperation(
			categoriesSvelteStore.update(id, updateInfo),
			categoriesObjectStoreHelper.update(id, updateInfo)
		);
	}

	return {
		store: categoriesSvelteStore,
		add,
		remove,
		update
	};
}
