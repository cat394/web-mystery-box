export type DataRecord = Record<string, any>;

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

export type OpenDBHandlers = {
	onupgradeneeded: (event: IDBVersionChangeEvent) => void;
	onblocked: (event: IDBVersionChangeEvent) => void;
};

export type StoreWriteOperationResult = Promise<IDBValidKey>;

export type IndexNameFromDBSetting<T extends DBSetting> = T['objectStores'][number]['indexes'] extends (infer I)[]
  ? I extends IndexSetting
    ? I['name']
    : never
  : never;
