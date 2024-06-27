import type { DBSetting } from "$lib/idb-helpers";

export type DBSettingFromDBSettings<T extends readonly DBSetting[]> = T[number];

export type DBNameFromDBSettings<T extends readonly DBSetting[]> =
	DBSettingFromDBSettings<T>['dbName'];

