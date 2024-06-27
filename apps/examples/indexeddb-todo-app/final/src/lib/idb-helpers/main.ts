import type {
	CursorHandler,
	DBSetting,
	EssentialFields,
	ObjectStoreNamesFromDBSetting,
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

export class IDBDatabaseHelper<DBSettingType extends DBSetting> extends IDBHelper {
	#db: IDBDatabase | undefined;

	constructor(
		public dbName: DBSettingType['dbName'],
		public dbVersion: number,
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
		const request = indexedDB.open(this.dbName, this.dbVersion);

		request.onupgradeneeded = handler.onupgradeneeded;

		request.onblocked = handler.onblocked;

		return await this.requestResult<IDBDatabase>(request);
	}

	transaction = (
		storeNames:
			| ObjectStoreNamesFromDBSetting<DBSettingType>
			| ObjectStoreNamesFromDBSetting<DBSettingType>[],
		transactionMode?: IDBTransactionMode
	): IDBTransaction => {
		return this.db.transaction(storeNames, transactionMode);
	};
}

export class IDBObjectStoreHelper<RecordType extends EssentialFields> extends IDBHelper {
	constructor(
		public db: IDBDatabase,
		public storeName: string
	) {
		super();
	}

	getObjectStore(mode?: IDBTransactionMode) {
		return this.db.transaction(this.storeName, mode).objectStore(this.storeName);
	}

	async get(key: RecordType['id']): Promise<RecordType> {
		const objectStore = this.getObjectStore();

		const request = objectStore.get(key);

		return await super.requestResult<RecordType>(request);
	}

	async getAll(query?: IDBKeyRange, count?: number): Promise<RecordType[]> {
		const objectStore = this.getObjectStore();

		const request = objectStore.getAll(query, count);

		return await super.requestResult<RecordType[]>(request);
	}

	async add(newData: RecordType): StoreWriteOperationResult<RecordType> {
		const objectStore = this.getObjectStore('readwrite');

		const request = objectStore.add(newData);

		return await super.requestResult<RecordType['id']>(request);
	}

	async update(
		key: RecordType['id'],
		newData: Partial<RecordType>
	): StoreWriteOperationResult<RecordType> {
		const currentData = await this.get(key);

		const objectStore = this.getObjectStore('readwrite');

		const merged = { ...currentData, ...newData };

		const request = objectStore.put(merged);

		return await super.requestResult<RecordType['id']>(request);
	}

	async remove(key: RecordType['id']): StoreWriteOperationResult<RecordType> {
		const objectStore = this.getObjectStore('readwrite');

		const request = objectStore.delete(key);

		return await super.requestResult<RecordType['id']>(request);
	}
}

export class IDBIndexHelper<RecordType extends EssentialFields> extends IDBHelper {
	index: IDBIndex;

	constructor(
		protected objectStore: IDBObjectStore,
		protected indexName: string
	) {
		super();
		this.index = this.objectStore.index(this.indexName);
	}

	async get(key: RecordType['id']): Promise<RecordType> {
		const request = this.index.get(key);

		return await super.requestResult<RecordType>(request);
	}

	async getAll(query?: RecordType['id'] | IDBKeyRange, count?: number): Promise<RecordType[]> {
		const request = this.index.getAll(query, count);

		return await super.requestResult<RecordType[]>(request);
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
