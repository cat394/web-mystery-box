// ===========================================================================================

// Firstly, what do we want to achieve?

// - I want the IndexedDB API to be type-safe!

// - I'd be happy to make every database request and get just that result back!

// ===========================================================================================



// ===========================================================================================

// My Dream...

// 1. Initialize database

// Define the database name, version, and handlers for different IndexedDB events.

// const dbName = 'DATABASE_NAME';
// const dbVersion = DATABASE_VERSION;
// const dbHandlers = {
//   onupgradeneeded: (db: IDBDatabase) => {
//     db.createObjectStore('OBJECTSTORE_NAME');
//   },
//   onblocked: () => {
//     const reloadOK = window.confirm(
//       'Database version change is blocked. Please reload the page to continue.'
//     );

//     if (reloadOK) {
//       window.location.reload();
//     }
//   },
//   onversionchange: (db: IDBDatabase) => {
//     db.close();
//     alert('A new version of this page is ready. Please reload or close this tab!');
//   }
// }

// Create an instance of IDBDatabaseManager and initialize the database.

// const dbHelper = new IDBDatabaseManager<DATABASE_SETTING>(dbName, dbVersion, dbHandlers);

// await dbHelper.init()


// ********************************************************************************************


// 2. Using the IndexedDB database

// The IDBDatabaseManager API is designed to provide similar functionality to the native IndexedDB API.

// - Create a transaction using the transaction method which returns an IDBTransactionManager instance.

// const transaction = dbHelper.transaction(['OBJECTSTORE_NAME'], 'readwrite');


// - Access the object store through the transaction manager, returning an IDBObjectStoreManager instance.

// const objectStore = transaction.objectStore('OBJECTSTORE_NAME');


// - Access the index through the object store manager, returning an IDBIndexManager instance.

// const index = objectStore.index('INDEX_NAME');

// The class hierarchy follows this structure:
// -> IDBDatabaseManager -> IDBTransactionManager -> IDBObjectStoreManager -> IDBIndexManager

// Each class acts as a delegate for its corresponding IndexedDB entity (IDBDatabase, IDBTransaction, IDBObjectStore, and IDBIndex).


// ********************************************************************************************


// 3. Retrieve data from the database

// To get a single record from an object store by key:

// const data = await transaction
//                      .objectStore<RECORD_TYPE>('OBJECTSTORE_NAME')
//                      .get(KEY); // Returns a Promise resolving to the record.

// To get all records from an index in the object store:

// const allData = await transaction
//                          .objectStore<RECORD_TYPE>('OBJECTSTORE_NAME')
//                          .index<INDEX_NAME>('INDEX_NAME')
//                          .getAll(); // Returns a Promise resolving to an array of records.

// ===========================================================================================




/*
  IDBHelper

  Description: A base class providing common methods for handling IndexedDB requests.

  - Methods

    requestResult(request: IDBRequest) -> Promise<SuccessReturnType>
    - Returns a Promise that resolves with the result of a successful IndexedDB request or rejects with an error.
*/

/*
  IDBDatabaseManager

  Description: Manages the IndexedDB database, including opening, version changes, and transactions.

  - Constructor

    dbName: The name of the database.
    dbVersion: The version of the database.
    dbHandlers: An object with handlers for onupgradeneeded, onblocked, and onversionchange events.

  - Methods

    openDB() -> Promise<IDBDatabase>
    - Opens the database with the given name and version, returning a Promise that resolves with the IDBDatabase object.

    init() -> Promise<IDBDatabase>
    - Initializes the database, storing the resulting IDBDatabase object internally and setting up version change handlers.

    transaction(storeNames: string[], mode: IDBTransactionMode = 'readonly') -> IDBTransactionManager<T>
    - Starts a transaction with the specified object stores and mode, returning an IDBTransactionManager instance.

  - Properties

    db -> IDBDatabase
    - The current instance of the IDBDatabase object. Throws an error if the database is not initialized.
*/

/*
  IDBTransactionManager

  Description: Manages transactions and object stores for a given database.

  - Constructor

    db: The IDBDatabase instance to create transactions on.
    storeNames: An array of object store names to include in the transaction.
    mode: The transaction mode, either 'readonly' or 'readwrite'.

  - Methods

    objectStore(storeName: string) -> IDBObjectStoreManager<T, RecordType>
    - Returns an IDBObjectStoreManager instance for the specified object store name.

  - Properties

    #objectStores -> Record<string, IDBObjectStoreManager<T, RecordType>>
    - A private map of object store names to their corresponding IDBObjectStoreManager instances.
*/

/*
  IDBObjectStoreManager

  Description: Provides methods to interact with an IndexedDB object store.

  - Constructor

    transaction: The IDBTransaction instance that this object store belongs to.
    storeName: The name of the object store to manage.

  - Methods

    get(key: T2['id']) -> Promise<T2>
    - Retrieves a record from the object store by key.

    getAll(query?: IDBKeyRange, count?: number) -> Promise<T2[]>
    - Retrieves all records matching the query, up to the specified count.

    add(newData: T2) -> StoreWriteOperationResult<T2>
    - Adds a new record to the object store, returning the key of the added record.

    update(key: T2['id'], newData: Partial<T2>) -> StoreWriteOperationResult<T2>
    - Updates an existing record by key with the provided new data.

    remove(key: T2['id']) -> StoreWriteOperationResult<T2>
    - Deletes a record from the object store by key.

    index(indexName: string) -> IDBIndexManager<RecordType>
    - Returns an IDBIndexManager instance for the specified index name.

  - Properties

    #objectStore -> IDBObjectStore
    - A private getter for the IDBObjectStore instance associated with this manager.
*/

/*
  IDBIndexManager

  Description: Provides methods to interact with an IndexedDB index.

  - Constructor

    objectStore: The IDBObjectStore instance to which this index belongs.
    indexName: The name of the index to manage.

  - Methods

    get(key: RecordType['id']) -> Promise<RecordType>
    - Retrieves a record from the index by key.

    getAll(query?: IDBKeyRange, count?: number) -> Promise<RecordType[]>
    - Retrieves all records matching the query, up to the specified count.

    openCursor(cursorHandler: CursorHandler, query?: RecordType['id'] | IDBKeyRange, direction?: IDBCursorDirection) -> Promise<void>
    - Opens a cursor to iterate over records in the index, invoking the cursorHandler for each record.

  - Properties

    index -> IDBIndex
    - The IDBIndex instance associated with this manager.
*/

