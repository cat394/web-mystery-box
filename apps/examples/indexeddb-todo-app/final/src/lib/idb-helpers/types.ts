import type { getId } from "$lib/utils";

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

export type CursorHandlers = {
	onsuccess: (
		resolve: (value: void | PromiseLike<void>) => void,
		cursor: IDBCursorWithValue
	) => void;
};

export interface EssentialFields {
	id: ReturnType<typeof getId>;
}

export type WriteOperationResult = IDBValidKey;

export type ObjectStoreOperationResult = Promise<WriteOperationResult>;

export type ObjectStoreOperation = () => ObjectStoreOperationResult;

export type IndexNameFromDBSetting<T extends DBSetting> = T['objectStores'][number]['indexes'] extends (infer I)[]
  ? I extends IndexSetting
    ? I['name']
    : never
  : never;
