/*
  DBHelper API:
  
  1. Define DB setting
  
  const dbName = 'todoAppDB';
  const dbVersion = 1;
  const dbOpenHandler = {
    onupgradeneeded: () => {},
  
    // This is error handling
    // Event that occurs if there are database connections open in other tabs or windows that are preventing the database from being upgraded.
    onblocked: () => {}
  };
  
  
  2. Instantiate a class
  
  const dbHelper = new IDBDatabaseHelper(dbName, dbVersion, dbOpenHandler);
  
  
  3. Initialize db & start transaction
  
  try {
    await dbHelper.init();
  
    const transaction = dbHelper.startTransaction([OBJECT_STORE_NAMES], TRANSACTION_OPTION);
  
    ...
  
  } catch(error) {
    console.error(error);
  }
*/ 


/*
  ObjectStoreHelper API
  
  1. Define object store setting
  
  const objectStoreName = 'todos';
  
  
  2. Instantiate a class
  
  const objectStoreHelper = new IDBObjectStoreHelper(dbHelper, objectStoreName);
  
  
  3. Get data from object store
  try {
  
   - Get a Single Record:
  
   const data = await objectStoreHelper.get(KEY); 
  
  
   - Get multiple records:
  
   const allData = await objectStoreHelper.getAll();
  
  
   - Add new record:
  
   await objectStoreHelper.add(NEW_DATA);
  
  
   - Update a record:
  
   await objectStoreHelper.update(KEY, UPDATEINFO);
  
  
   - Remove a record:
  
   await objectStoreHelper.remove(KEY);
    
  } catch {
    console.error(error);
  }
*/ 
