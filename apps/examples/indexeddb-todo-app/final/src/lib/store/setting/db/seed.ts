import type { DBSetting } from "$lib/idb-helpers";
import { initDB } from "./init-function";

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
					name: 'category',
					keyPath: 'categoryIds',
					options: { multiEntry: true }
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

const dbSettings = [todoAppDB] as const;

export const db = initDB<typeof dbSettings>(dbSettings);
