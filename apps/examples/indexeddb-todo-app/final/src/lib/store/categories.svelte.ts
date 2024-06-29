import type {
	StoreWriteOperationResult,
	EssentialFields,
	IDBDatabaseManager
} from '$lib/idb-helpers';
import { getId } from '$lib/utils';
import type { todoAppDB } from './setting/db/seed';

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
	#db: IDBDatabaseManager<typeof todoAppDB>;
	#svelteCategoriesStore: Categories;

	constructor(todoAppDB: IDBDatabaseManager<typeof todoAppDB>, initialCategories: Category[] = []) {
		this.#db = todoAppDB;
		this.#svelteCategoriesStore = new Categories(initialCategories);
	}

	get store() {
		return this.#svelteCategoriesStore;
	}

	get #objectStore() {
		return this.#db.transaction(['categories']).objectStore('categories');
	}

	async add({ name }: Pick<Category, 'name'>): StoreWriteOperationResult<Category> {
		const newCategory: Category = {
			id: getId(),
			name
		};

		this.#svelteCategoriesStore.add(newCategory);
		return await this.#objectStore.add(newCategory);
	}

	async remove(id: Category['id']): StoreWriteOperationResult<Category> {
		this.#svelteCategoriesStore.remove(id);
		return await this.#objectStore.remove(id);
	}

	async update(
		id: Category['id'],
		updateInfo: Partial<Category>
	): StoreWriteOperationResult<Category> {
		this.#svelteCategoriesStore.update(id, updateInfo);
		return await this.#objectStore.update(id, updateInfo);
	}
}
