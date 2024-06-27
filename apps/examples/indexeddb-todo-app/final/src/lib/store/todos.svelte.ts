import type {
	IDBObjectStoreHelper,
	StoreWriteOperationResult,
	EssentialFields
} from '$lib/idb-helpers';
import { getId } from '$lib/utils';
import { isEmpty } from '$lib/utils';

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
	#svelteTodosStore: Todos;
	#todosObjectStoreHelper: IDBObjectStoreHelper<Todo>;

	constructor(initialTodos: Todo[], todosObjectStoreHelper: IDBObjectStoreHelper<Todo>) {
		this.#svelteTodosStore = new Todos(initialTodos);
		this.#todosObjectStoreHelper = todosObjectStoreHelper;
	}

	get store() {
		return this.#svelteTodosStore;
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
		return await this.#todosObjectStoreHelper.add(newTodo);
	}

	async remove(id: Todo['id']): StoreWriteOperationResult<Todo> {
		this.#svelteTodosStore.remove(id);
		return await this.#todosObjectStoreHelper.remove(id);
	}

	async update(id: Todo['id'], updateInfo: Partial<Todo>): StoreWriteOperationResult<Todo> {
		this.#svelteTodosStore.update(id, updateInfo);
		return await this.#todosObjectStoreHelper.update(id, updateInfo);
	}
}
