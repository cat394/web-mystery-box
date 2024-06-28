// Part8-------------------------------------------------------------------------------------------

// export interface Todo {}

// export class Todos {
// 	// These arrays should be reactive!
// 	todos = [];
// 	remaining = [];
// 	finished = [];

// 	constructor(initialTodos: Todo[]) {
// 		this.todos = initialTodos;
// 	}

// 	add() {}

// 	remove() {}

// 	update() {}
// }

// -----------------------------------------------------------------------------------------------

// Part10-----------------------------------------------------------------------------------------

// export class TodoStore {
//  #db: IDBDatabaseManager<typeof todoAppDB>;
//  #svelteTodosStore: Todos;


//  constructor(dbHelper: IDBDatabaseManager<typeof todoAppDB>, initialTodos: Todo[]) {
//    this.#db = dbHelper;
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
