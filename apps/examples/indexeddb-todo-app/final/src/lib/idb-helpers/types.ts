export interface EssentialFields {
	id: IDBValidKey;
}

export type DBSetting = { dbName: string; dbVersion: number; objectStores: StoreDetail[] };

export type IndexSetting = {
	name: string;
	keyPath: string | string[];
	options?: IDBIndexParameters;
};

export type StoreDetail = {
	name: string;
	options: IDBObjectStoreParameters;
	indexes?: IndexSetting[];
};

type InitDBHandler = (db: IDBDatabase) => void;

export interface InitDBHandlers {
	onupgradeneeded: InitDBHandler;
	onblocked: InitDBHandler;
	onversionchange: InitDBHandler;
}
export interface CursorHandler {
	onsuccess: (
		resolve: (value: any) => void,
		cursor: IDBCursorWithValue
	) => ReturnType<PromiseConstructor['resolve']>;
}

export type StoreWriteOperationResult<T extends EssentialFields> = Promise<T['id']>;

export type DBNameFromDBSetting<T extends DBSetting> = T['dbName'];

export type DBVersionFromDBSetting<T extends DBSetting> = T['dbVersion'];

export type ObjectStoreNameFromDBSetting<T extends DBSetting> = T['objectStores'][number]['name'];

export type IndexNameFromObjectStore<
	T extends DBSetting,
	K extends ObjectStoreNameFromDBSetting<T>
> = T['objectStores'] extends (infer ObjectStore)[]
	? ObjectStore extends { name: K; indexes: { name: infer I }[] }
		? I
		: never
	: never;

export type DBSettingFromDBSettings<T extends readonly DBSetting[]> = T[number];

export type DBNameFromDBSettings<T extends readonly DBSetting[]> =
	DBSettingFromDBSettings<T>['dbName'];
