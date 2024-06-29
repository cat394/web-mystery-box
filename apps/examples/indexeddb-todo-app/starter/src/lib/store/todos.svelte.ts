// Part8-------------------------------------------------------------------------------------------

// import { getId } from "$lib/utils";
// import type { EssentialFields } from '$lib/idb-helpers';

// export interface Todo extends EssentialFields {
// 	todo: string;
// 	completed: boolean;
// 	createdAt: number;
// }

// export class Todos {

//  // We want to make these arrays reactive!
// 	todos = [];
// 	remaining = this.todos.filter((todo) => !todo.completed));
// 	finished = this.todos.filter((todo) => todo.completed));

// 	constructor(initialTodos: Todo[]) {
// 		this.todos = initialTodos;
// 	}

//  add(todo: Todo['todo']): Todo['id'] {
//    const todoId = getId();

// 	  const newTodo = {
//      id: todoId,
//      todo,
//      completed: false,
//      createdAt: Date.now()
//    }

//    this.todos.push(newTodo);

// 	  return todoId;
//  }

// 	remove(id: Todo['id']): Todo['id'] {
// 		this.todos = this.todos.filter((todo) => todo.id !== id);
// 		return id;
// 	}

// 	update(id: Todo['id'], updateInfo: Partial<Todo>): Todo['id'] {
// 		this.todos = this.todos.map((todo) => {
// 			if (todo.id !== id) return todo;

// 			const merged = { ...todo, ...updateInfo };

// 			return merged;
// 		});
// 		return id;
// 	}
// }
// -----------------------------------------------------------------------------------------------

// Part10-----------------------------------------------------------------------------------------

// export class TodoStore {
//  #db: IDBDatabaseManager<typeof todoAppDB>;
//  #svelteTodosStore: Todos;

//  constructor(todoAppDB: IDBDatabaseManager<typeof todoAppDB>, initialTodos: Todo[]) {
//    this.#db = todoAppDB;
//    this.#svelteTodosStore = new Todos(initialTodos);
//  }

// 	// To access the reactive data from outside, we use the store property, because the name 'svelteTodosStore' is too long!
// 	get store() {
// 		return this.#svelteTodosStore;
// 	}

//   get #objectStore() {
//     return this.#db.transaction(['todos']).objectStore<Todo>('todos');
//   }

// 	async add() {}

// 	async remove() {}

// 	async update() {}
// }

// -------------------------------------------------------------------------------------------------
