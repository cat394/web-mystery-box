import type { Category } from './categories.svelte';
import type { EssentialFields, IDBObjectStoreHelper, WriteOperationResult } from '$lib/idb-helpers';
import type {
	ReturnCreateStoreFn,
	StoreMethods,
	StoreOperation,
	StoreWriteOperationResult
} from './types';
import { getId } from '$lib/utils';
import { executeOperation } from './executeOperation';
import { isEmpty } from '$lib/utils';

export interface Todo extends EssentialFields {
	todo: string;
	completed: boolean;
	createdAt: number;
	categoryIds?: Category['id'][];
}

type FieldNamesRequiredWhenAddingData = 'todo' | 'categoryIds';

type ModifiableDataFields = Omit<Todo, 'id'>;

export type TodosStore = ReturnCreateStoreFn<
	Todos,
	ModifiableDataFields,
	FieldNamesRequiredWhenAddingData
>;
export class Todos implements StoreMethods<Todo> {
	todos = $state<Todo[]>([]);
	remaining = $derived(this.todos.filter((todo) => !todo.completed));
	finished = $derived(this.todos.filter((todo) => todo.completed));

	constructor(initialTodos: Todo[]) {
		this.todos = initialTodos;
	}

	add =
		(newTodo: Todo): StoreOperation =>
		(): WriteOperationResult => {
			this.todos.push(newTodo);

			return newTodo.id;
		};

	remove =
		(id: Todo['id']): StoreOperation =>
		(): WriteOperationResult => {
			this.todos = this.todos.filter((todo) => todo.id !== id);
			return id;
		};

	update =
		(id: Todo['id'], updateInfo: Partial<Todo>): StoreOperation =>
		(): WriteOperationResult => {
			this.todos = this.todos.map((todo) => {
				if (todo.id !== id) return todo;

				const merged = { ...todo, ...updateInfo };

				return merged;
			});
			return id;
		};
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

		return await executeOperation(
			svelteTodosStore.add(newTodo),
			todosObjectStoreHelper.add(newTodo)
		);
	}

	async function remove(id: Todo['id']): StoreWriteOperationResult {
		return await executeOperation(svelteTodosStore.remove(id), todosObjectStoreHelper.remove(id));
	}

	async function update(id: Todo['id'], updateInfo: Partial<Todo>): StoreWriteOperationResult {
		return await executeOperation(
			svelteTodosStore.update(id, updateInfo),
			todosObjectStoreHelper.update(id, updateInfo)
		);
	}

	return {
		store: svelteTodosStore,
		add,
		remove,
		update
	};
}
