import {
	IDBDatabaseHelper,
	IDBIndexHelper,
	IDBObjectStoreHelper,
	type DBSetting,
	type EssentialFields
} from '$lib/idb-helpers';
import type { IndexNameFromDBSetting } from '$lib/idb-helpers/types';
import { createObjectStoreHelperFactory, initDB } from '../helper-functions';

export const todoAppDB = {
	dbName: 'todoApp',
	dbVersion: 1,
	objectStores: [
		{
			name: 'todos',
			options: {
				keyPath: 'id'
			},
			indexes: [
				{
					name: 'date',
					keyPath: 'createdAt',
					options: { unique: true }
				},
				{
					name: 'category',
					keyPath: 'categoryIds',
					options: { multiEntry: true }
				},
				{
					name: 'categorySortedCreatedAt',
					keyPath: ['createdAt', 'categoryIds']
				}
			]
		},
		{
			name: 'categories',
			options: {
				keyPath: 'id'
			},
			indexes: [
				{
					name: 'name',
					keyPath: 'name',
					options: { unique: true }
				}
			]
		}
	]
} as const satisfies DBSetting;

export const dbSettings = [todoAppDB] as const;

const db = initDB<typeof dbSettings>(dbSettings);

export const getTodoAppDB = async () => (await db<typeof todoAppDB>('todoApp')).db;

export const getTodoAppDBObjectStoreHelperFactory = (db: IDBDatabase) => {
	return createObjectStoreHelperFactory<typeof todoAppDB>(db);
};

export const getTodosAppDBObjectStoreIndexHelper = <RecordType extends EssentialFields>(
	objectStoreHelper: IDBObjectStoreHelper<RecordType>,
	indexName: IndexNameFromDBSetting<typeof todoAppDB>
) => {
	return new IDBIndexHelper<typeof todoAppDB, RecordType>(objectStoreHelper, indexName);
};
