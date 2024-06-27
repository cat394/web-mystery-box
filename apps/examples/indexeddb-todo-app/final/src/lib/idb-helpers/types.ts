export interface EssentialFields {
	id: IDBValidKey;
};

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

export interface OpenDBHandlers {
	onupgradeneeded: (event: IDBVersionChangeEvent) => void;
	onblocked: (event: IDBVersionChangeEvent) => void;
}
export interface CursorHandler {
	onsuccess: (
		resolve: (value: any) => void,
		cursor: IDBCursorWithValue
	) => ReturnType<PromiseConstructor['resolve']>;
}

export type StoreWriteOperationResult<T extends EssentialFields> = Promise<T['id']>;

export type ObjectStoreNamesFromDBSetting<T extends DBSetting> = T['objectStores'][number]['name'];
