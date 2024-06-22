export interface Todo {
	id: string;
	todo: string;
	completed: boolean;
	createdAt: number;
}

export class Todos {
	todos: Todo[];

	constructor(initialTodos: Todo[]) {
		this.todos = $state(initialTodos);
	}

	add(todo: Todo) {
		this.todos.push(todo);
	}

	remove(id: Todo['id']) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
	}

	update(id: Todo['id'], updateInfo: Partial<Todo>) {
		this.todos = this.todos.map((todo) => {
			if (todo.id !== id) return todo;

			const merged = { ...todo, ...updateInfo };

			return merged;
		});
	}
}
