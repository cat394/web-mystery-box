// Part 8------------------------------------------------
/*
  Todos class

  1. Instantiate a class

    const initialTodos = [...];

    const todosStore = new Todos(initialTodos);


  2. Get reactive todos

    - Get all todos

    todosStore.todos


    - Get only remaining todos
    
    todosStore.remaining -> Todos whose completed property is false


    - Get only finished todos
    
    todosStore.finished -> Todos whose completed property is true


  3. Manipulate todos

  - Add a new todo

    todosStore.add(...);


  - Update a todo

    todosStore.update(...);


  - Delete a todo

    todosStore.delete(...);
*/

// ------------------------------------------------------------------------------

// Part 10------------------------------------------------------------------------
/*
  createTodosStore()

  1. Create an object with reactive todos and methods to manipulate them

  const todosStore = createTodosStore(initialTodos, todosObjectStoreHelper);

  Q: Why does this function need to receive objectStoreHelper from outside?

  A: This function handles the basic object store operations, so if you are using an IDBIndex object to find data, 
      you must instantiate an IDBObjectStoreHelper outside of this function. 


  2.  Get reactive todos

  todosStore.store -> Svelte Todos instance

  - Get all todos

  todosStore.store.todos

  
  - Get only remaining todos

  todosStore.store.remaining


  - Get only finished todos

  todosStore.store.finished


  3. Manipulate todos method

  - Add a new todo

  todosStore.add()


  - Update a todo

  todosStore.update()


  - Delete a todo

  todosStore.delete()
*/
// ---------------------------------------------------------------------------
