import type {
	DataRecord,
	DBSetting,
	IndexNameFromDBSetting,
	OpenDBHandlers,
	StoreWriteOperationResult
} from './types';

class IDBHelper {
	protected requestResult<SuccessReturnType>(request: IDBRequest): Promise<SuccessReturnType> {
		return new Promise((resolve, reject) => {
			request.onsuccess = (event: Event) => {
				const result = (event.target as IDBRequest).result;

				resolve(result);
			};

			request.onerror = (event: Event) => {
				const error = (event.target as IDBRequest).error as DOMException;

				reject(error);
			};
		});
	}
}

export class IDBDatabaseHelper<T extends DBSetting = any> extends IDBHelper {
	#db: IDBDatabase | undefined;

	constructor(
		public dbName: T['dbName'],
		public version: number,
		public handlers: OpenDBHandlers
	) {
		super();
	}

	get db(): IDBDatabase {
		if (!this.#db) {
			throw new Error('Database not initialized');
		}
		return this.#db;
	}

	async init(): Promise<IDBDatabase> {
		try {
			this.#db = await this.openDB(this.handlers);
			return this.#db;
		} catch (error) {
			throw new Error(`Failed to open database: ${error}`);
		}
	}

	async openDB(handler: OpenDBHandlers): Promise<IDBDatabase> {
		const request = indexedDB.open(this.dbName, this.version);

		request.onupgradeneeded = handler.onupgradeneeded;

		request.onblocked = handler.onblocked;

		return await this.requestResult<IDBDatabase>(request);
	}
}

export class IDBObjectStoreHelper<
	RecordType extends DataRecord = DataRecord
> extends IDBHelper {
	constructor(
		public db: IDBDatabase,
		public storeName: string
	) {
		super();
	}

	#getTransaction(transactionMode: IDBTransactionMode) {
		return this.db.transaction(this.storeName, transactionMode);
	}

	get #readonlyTransaction() {
		return this.#getTransaction('readonly');
	}

	get #readwriteTransaction() {
		return this.#getTransaction('readwrite');
	}

	#getObjectStore(transaction: IDBTransaction): IDBObjectStore {
		return transaction.objectStore(this.storeName);
	}

	async get(key: IDBValidKey): Promise<RecordType> {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		const request = objectStore.get(key);

		return await super.requestResult<RecordType>(request);
	}

	async getAll(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<RecordType[]> {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		const request = objectStore.getAll(query, count);

		return await super.requestResult<RecordType[]>(request);
	}

	async add<KeyType extends IDBValidKey = IDBValidKey>(
		newData: RecordType
	): StoreWriteOperationResult {
		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.add(newData);

		return await super.requestResult<KeyType>(request);
	}

	async update<KeyType extends IDBValidKey = IDBValidKey>(
		key: KeyType,
		newData: Partial<RecordType>
	): StoreWriteOperationResult {
		const currentData = await this.get(key);

		const merged = { ...currentData, ...newData };

		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.put(merged);

		return await super.requestResult<KeyType>(request);
	}

	async remove<KeyType extends IDBValidKey = IDBValidKey>(key: KeyType): StoreWriteOperationResult {
		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.delete(key);

		return await super.requestResult<KeyType>(request);
	}

	getIndex(indexName: string): IDBIndex {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		return objectStore.index(indexName);
	}
}

export class IDBIndexHelper<
	DBSettingType extends DBSetting,
	RecordType extends DataRecord
> extends IDBHelper {
	constructor(
		protected objectStoreHelper: IDBObjectStoreHelper<RecordType>,
		protected indexName: IndexNameFromDBSetting<DBSettingType>
	) {
		super();
	}

	get #index(): IDBIndex {
		return this.objectStoreHelper.getIndex(this.indexName);
	}

	async get(key: IDBValidKey): Promise<RecordType> {
		const request = this.#index.get(key);
		return await super.requestResult<RecordType>(request);
	}

	async getAll(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<RecordType[]> {
		const request = this.#index.getAll(query, count);
		return await super.requestResult<RecordType[]>(request);
	}

	async openCursor(
		query?: IDBValidKey | IDBKeyRange,
		direction?: IDBCursorDirection
	): Promise<IDBCursor> {
		const request = this.#index.openCursor(query, direction);

		return new Promise((resolve, reject) => {
			request.onsuccess = (event: Event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

				resolve(cursor);
			};
			request.onerror = (event: Event) => {
				const error = (event.target as IDBRequest).error;

				reject(error);
			};
		});
	}
}
