import type { Category } from './categories.svelte';
import type { IDBObjectStoreHelper, StoreWriteOperationResult } from '$lib/idb-helpers';
import type { EssentialFields, ReturnCreateStoreFn } from './types';
import { getId } from '$lib/utils';
import { isEmpty } from '$lib/utils';

export interface Todo extends EssentialFields {
	todo: string;
	completed: boolean;
	createdAt: number;
	categoryIds?: Category['id'][];
}

type FieldNamesRequiredWhenAddingData = 'todo' | 'categoryIds';

type ModifiableDataFields = Pick<Todo, 'todo' | 'completed' | 'categoryIds'>;

export type TodosStore = ReturnCreateStoreFn<
	Todos,
	ModifiableDataFields,
	FieldNamesRequiredWhenAddingData
>;
export class Todos {
	todos = $state<Todo[]>([]);
	remaining = $derived(this.todos.filter((todo) => !todo.completed));
	finished = $derived(this.todos.filter((todo) => todo.completed));

	constructor(initialTodos: Todo[]) {
		this.todos = initialTodos;
	}

	add(newTodo: Todo): Todo['id'] {
		this.todos.push(newTodo);

		return newTodo.id;
	}

	remove(id: Todo['id']): Todo['id'] {
		this.todos = this.todos.filter((todo) => todo.id !== id);
		return id;
	}

	update(id: Todo['id'], updateInfo: Partial<Todo>): Todo['id'] {
		this.todos = this.todos.map((todo) => {
			if (todo.id !== id) return todo;

			const merged = { ...todo, ...updateInfo };

			return merged;
		});
		return id;
	}
}

export function createTodosStore(
	initialTodos: Todo[] = [],
	todosObjectStoreHelper: IDBObjectStoreHelper<Todo>
): TodosStore {
	const svelteTodosStore = new Todos(initialTodos);

	async function add({
		todo,
		categoryIds
	}: {
		todo: Todo['todo'];
		categoryIds: Exclude<Todo['categoryIds'], undefined>;
	}): StoreWriteOperationResult {
		let newTodo: Todo = {
			id: getId(),
			todo,
			completed: false,
			createdAt: Date.now()
		};

		if (!isEmpty(categoryIds)) {
			newTodo = { ...newTodo, categoryIds };
		}

		svelteTodosStore.add(newTodo);

		return await todosObjectStoreHelper.add(newTodo);
	}

	async function remove(id: Todo['id']): StoreWriteOperationResult {
		svelteTodosStore.remove(id);
		return await todosObjectStoreHelper.remove(id);
	}

	async function update(id: Todo['id'], updateInfo: Partial<Todo>): StoreWriteOperationResult {
		svelteTodosStore.update(id, updateInfo);
		return await todosObjectStoreHelper.update(id, updateInfo);
	}

	return {
		store: svelteTodosStore,
		add,
		remove,
		update
	};
}
