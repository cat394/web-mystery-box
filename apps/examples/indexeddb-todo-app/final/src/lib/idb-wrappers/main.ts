import type {
	CursorHandler,
	DBNameFromDBSetting,
	DBSetting,
	DBVersionFromDBSetting,
	EssentialFields,
	IndexNameFromObjectStore,
	ObjectStoreNameFromDBSetting,
	InitDBHandlers,
	StoreDetail,
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

class IDBTransactionManager<T extends DBSetting> extends IDBHelper {
	#transaction: IDBTransaction;
	#objectStores: Record<StoreDetail['name'], IDBObjectStoreManager<T>> = {};

	constructor(
		public db: IDBDatabase,
		storeNames: ObjectStoreNameFromDBSetting<T>[],
		mode: IDBTransactionMode = 'readonly'
	) {
		super();
		this.#transaction = db.transaction(storeNames, mode);

		storeNames.forEach((storeName) => {
			this.#objectStores[storeName] = new IDBObjectStoreManager<T>(this.#transaction, storeName);
		});
	}

	objectStore<RecordType extends EssentialFields>(
		storeName: ObjectStoreNameFromDBSetting<T>
	): IDBObjectStoreManager<T, RecordType> {
		return this.#objectStores[storeName];
	}
}

export class IDBDatabaseManager<T extends DBSetting = DBSetting> extends IDBHelper {
	#db: IDBDatabase | undefined;

	constructor(
		public dbName: DBNameFromDBSetting<T>,
		public dbVersion: DBVersionFromDBSetting<T>,
		public handlers: InitDBHandlers
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
			this.#db = await this.openDB();
			this.#db.onversionchange = () => this.handlers.onversionchange(this.db);
			return this.#db;
		} catch (error) {
			throw error;
		}
	}

	async openDB(): Promise<IDBDatabase> {
		const request = indexedDB.open(this.dbName, this.dbVersion);

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = (event.target as IDBOpenDBRequest).result;

			this.handlers.onupgradeneeded(db);
		};

		request.onblocked = () => this.handlers.onblocked(this.db);

		return await this.requestResult<IDBDatabase>(request);
	}

	transaction(
		storeNames: ObjectStoreNameFromDBSetting<T>[],
		mode: IDBTransactionMode = 'readonly'
	): IDBTransactionManager<T> {
		return new IDBTransactionManager<T>(this.db, storeNames, mode);
	}
}

export class IDBObjectStoreManager<
	T1 extends DBSetting = any,
	T2 extends EssentialFields = any
> extends IDBHelper {
	constructor(
		public transaction: IDBTransaction,
		public storeName: ObjectStoreNameFromDBSetting<T1>
	) {
		super();
	}

	get #objectStore(): IDBObjectStore {
		return this.transaction.objectStore(this.storeName);
	}

	async get(key: T2['id']): Promise<T2> {
		const request = this.#objectStore.get(key);
		return await super.requestResult<T2>(request);
	}

	async getAll(query?: IDBKeyRange, count?: number): Promise<T2[]> {
		const request = this.#objectStore.getAll(query, count);
		return await super.requestResult<T2[]>(request);
	}

	async add(newData: T2): StoreWriteOperationResult<T2> {
		const request = this.#objectStore.add(newData);
		return await super.requestResult<T2['id']>(request);
	}

	async update(key: T2['id'], newData: Partial<T2>): StoreWriteOperationResult<T2> {
		const currentData = await this.get(key);
		const merged = { ...currentData, ...newData };
		const request = this.#objectStore.put(merged);
		await super.requestResult<T2>(request);
		return key;
	}

	async remove(key: T2['id']): StoreWriteOperationResult<T2> {
		const request = this.#objectStore.delete(key);
		await super.requestResult<undefined>(request);
		return key;
	}

	index<const K extends ObjectStoreNameFromDBSetting<T1>>(
		indexName: IndexNameFromObjectStore<T1, K>
	): IDBIndexManager<T2> {
		return new IDBIndexManager<T2>(this.#objectStore, indexName as string);
	}
}

export class IDBIndexManager<RecordType extends EssentialFields> extends IDBHelper {
	index: IDBIndex;

	constructor(objectStore: IDBObjectStore, indexName: string) {
		super();
		this.index = objectStore.index(indexName);
	}

	async get(key: RecordType['id']): Promise<RecordType> {
		const request = this.index.get(key);
		return this.requestResult<RecordType>(request);
	}

	async getAll(query?: IDBKeyRange, count?: number): Promise<RecordType[]> {
		const request = this.index.getAll(query, count);
		return this.requestResult<RecordType[]>(request);
	}

	async openCursor(
		cursorHandler: CursorHandler,
		query?: RecordType['id'] | IDBKeyRange,
		direction?: IDBCursorDirection
	): Promise<void> {
		const request = this.index.openCursor(query, direction);
		return new Promise((resolve, reject) => {
			request.onsuccess = (event: Event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				cursorHandler.onsuccess(resolve, cursor);
			};
			request.onerror = (event: Event) => {
				const error = (event.target as IDBRequest).error;
				reject(error);
			};
		});
	}
}
