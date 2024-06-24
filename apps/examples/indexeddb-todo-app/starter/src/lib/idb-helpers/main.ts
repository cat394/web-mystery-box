import type { StoreWriteOperationResult } from "./types";

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

export class IDBDatabaseHelper extends IDBHelper {
	#db: IDBDatabase | undefined;

	constructor(
		public dbName: string,
		public version: number,
		public handlers: any
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

	async openDB(handler: any): Promise<IDBDatabase> {
		const request = indexedDB.open(this.dbName, this.version);

		request.onupgradeneeded = handler.onupgradeneeded;

		request.onblocked = handler.onblocked;

		return await this.requestResult<IDBDatabase>(request);
	}
}

export class IDBObjectStoreHelper extends IDBHelper {
	constructor(
		public db: IDBDatabase,
		public storeName: string
	) {
		super();
	}

	#getTransaction(options: IDBTransactionMode) {
		return this.db.transaction(this.storeName, options);
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

	async get(key: IDBValidKey): Promise<any> {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		const request = objectStore.get(key);

		return await super.requestResult(request);
	};

	async getAll(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]> {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		const request = objectStore.getAll(query, count);

		return await super.requestResult(request);
	};

	async add(newData: any): StoreWriteOperationResult {
		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.add(newData);

		return await super.requestResult(request);
	}

	async update(key: IDBValidKey, newData: any): StoreWriteOperationResult {
		const currentData = await this.get(key);

		const merged = { ...currentData, ...newData };

		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.put(merged);

		return await super.requestResult(request);
	}

	async remove(key: IDBValidKey): StoreWriteOperationResult {
		const objectStore = this.#getObjectStore(this.#readwriteTransaction);

		const request = objectStore.delete(key);

		return await super.requestResult(request);
	}

	getIndex(indexName: string): IDBIndex {
		const objectStore = this.#getObjectStore(this.#readonlyTransaction);

		return objectStore.index(indexName);
	}
}
