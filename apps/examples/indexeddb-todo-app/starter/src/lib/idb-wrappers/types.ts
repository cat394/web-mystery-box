export interface EssentialFields {
	id: IDBValidKey;
}

export type DBSetting = { dbName: string; dbVersion: number; objectStores: StoreDetail[] };

export type IndexSetting = {
	name: string;
	keyPath: string | string[];
	options?: IDBIndexParameters;
};

type StoreDetail = {
	name: string;
	options: IDBObjectStoreParameters;
	indexes?: IndexSetting[];
};

export interface InitDBHandlers {
	onupgradeneeded: (event: IDBVersionChangeEvent) => void;
	onblocked: (event: IDBVersionChangeEvent) => void;
}
export interface CursorHandlers {
	onsuccess: (cursor: IDBCursorWithValue) => void;
}

export type StoreWriteOperationResult<T extends IDBValidKey> = Promise<T>;

export type ObjectStoreNamesFromDBSetting<T extends DBSetting> = T['objectStores'][number]['name'];
