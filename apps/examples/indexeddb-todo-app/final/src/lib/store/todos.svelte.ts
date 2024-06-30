import type {
	StoreWriteOperationResult,
	EssentialFields,
	IDBDatabaseManager
} from '$lib/idb-wrappers';
import { getId } from '$lib/utils';
import { isEmpty } from '$lib/utils';
import type { todoAppDB } from './setting/db/seed';

export interface Todo extends EssentialFields {
	todo: string;
	completed: boolean;
	createdAt: number;
	categoryIds?: string[];
}

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

export class TodoStore {
	#db: IDBDatabaseManager<typeof todoAppDB>;
	#svelteTodosStore: Todos;

	constructor(todoAppDBManager: IDBDatabaseManager<typeof todoAppDB>, initialTodos: Todo[]) {
		this.#db = todoAppDBManager;
		this.#svelteTodosStore = new Todos(initialTodos);
	}

	get store() {
		return this.#svelteTodosStore;
	}

	get #objectStore() {
		return this.#db.transaction(['todos']).objectStore<Todo>('todos');
	}

	async add({
		todo,
		categoryIds
	}: Required<Pick<Todo, 'todo' | 'categoryIds'>>): StoreWriteOperationResult<Todo> {
		let newTodo: Omit<Todo, 'categoryIds'> = {
			id: getId(),
			todo,
			completed: false,
			createdAt: Date.now()
		};

		if (!isEmpty(categoryIds)) {
			newTodo = { ...newTodo, categoryIds } as Todo;
		}

		this.#svelteTodosStore.add(newTodo);
		return await this.#objectStore.add(newTodo);
	}

	async remove(id: Todo['id']): StoreWriteOperationResult<Todo> {
		this.#svelteTodosStore.remove(id);
		return await this.#objectStore.remove(id);
	}

	async update(id: Todo['id'], updateInfo: Partial<Todo>): StoreWriteOperationResult<Todo> {
		this.#svelteTodosStore.update(id, updateInfo);
		return await this.#objectStore.update(id, updateInfo);
	}
}
