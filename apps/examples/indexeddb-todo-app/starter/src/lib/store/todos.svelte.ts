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
// 	#svelteTodosStore: Todos;
// 	#todosObjectStoreHelper: IDBObjectStoreHelper<Todo>;

// 	constructor(initialTodos: Todo[], todosObjectStoreHelper: IDBObjectStoreHelper<Todo>) {
// 		this.#svelteTodosStore = new Todos(initialTodos);
// 		this.#todosObjectStoreHelper = todosObjectStoreHelper;
// 	}
// 	// To access the reactive data from outside, we use the store property, because the name 'svelteTodosStore' is too long!
// 	get store() {
// 		return this.#svelteTodosStore;
// 	}

// 	async add() {}

// 	async remove() {}

// 	async update() {}
// }

// -------------------------------------------------------------------------------------------------
