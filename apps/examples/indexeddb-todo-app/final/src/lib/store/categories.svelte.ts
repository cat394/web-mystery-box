import type {
	IDBObjectStoreHelper,
	StoreWriteOperationResult,
	EssentialFields
} from '$lib/idb-helpers';
import { getId } from '$lib/utils';

export interface Category extends EssentialFields {
	name: string;
}

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

	update(id: Category['id'], updateInfo: Partial<Category>): Category['id'] {
		this.categories = this.categories.map((category) => {
			if (category.id !== id) return category;

			const merged = { ...category, ...updateInfo };

			return merged;
		});
		return id;
	}
}

export class CategoryStore {
	#svelteCategoriesStore: Categories;
	#categoriesObjectStoreHelper: IDBObjectStoreHelper<Category>;

	constructor(
		initialCategories: Category[] = [],
		categoriesObjectStoreHelper: IDBObjectStoreHelper<Category>
	) {
		this.#svelteCategoriesStore = new Categories(initialCategories);
		this.#categoriesObjectStoreHelper = categoriesObjectStoreHelper;
	}

	get store() {
		return this.#svelteCategoriesStore;
	}

	async add({ name }: Pick<Category, 'name'>): StoreWriteOperationResult<Category> {
		const newCategory: Category = {
			id: getId(),
			name
		};

		this.#svelteCategoriesStore.add(newCategory);
		return await this.#categoriesObjectStoreHelper.add(newCategory);
	}

	async remove(id: Category['id']): StoreWriteOperationResult<Category> {
		this.#svelteCategoriesStore.remove(id);
		return await this.#categoriesObjectStoreHelper.remove(id);
	}

	async update(id: Category['id'], updateInfo: Partial<Category>): StoreWriteOperationResult<Category> {
		this.#svelteCategoriesStore.update(id, updateInfo);
		return await this.#categoriesObjectStoreHelper.update(id, updateInfo);
	}
}
