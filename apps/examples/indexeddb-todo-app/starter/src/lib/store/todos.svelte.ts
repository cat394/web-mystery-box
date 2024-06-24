import type { IDBObjectStoreHelper } from '$lib/idb-helpers/main';
import { getId } from '$lib/utils';
import type { ReturnCreateStoreFn } from './types';

export interface Todo {
	id: ReturnType<typeof getId>;
	todo: string;
	completed: boolean;
	createdAt: number;
}

type FieldNamesRequiredWhenAddingData = 'todo';

type ModifiableDataFields = Omit<Todo, 'id'>;

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
	initialTodos: Todo[],
	todosObjectStoreHelper: IDBObjectStoreHelper
): TodosStore {
	const svelteTodosStore = new Todos(initialTodos);

	async function add({ todo }: Pick<Todo, 'todo'>) {
		const todoId = getId();

		const newTodo: Todo = {
			id: todoId,
			todo,
			completed: false,
			createdAt: Date.now()
		};

		svelteTodosStore.add(newTodo);
		return await todosObjectStoreHelper.add(newTodo);
	}

	async function update(id: Todo['id'], updateInfo: Partial<Todo>) {
		svelteTodosStore.update(id, updateInfo);
		return await todosObjectStoreHelper.update(id, updateInfo);
	}

	async function remove(id: Todo['id']) {
		svelteTodosStore.remove(id);
		return await todosObjectStoreHelper.remove(id);
	}

	return {
		store: svelteTodosStore,
		add,
		update,
		remove
	};
}
