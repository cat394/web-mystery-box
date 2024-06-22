// import {
// 	IDBDatabaseHelper,
// 	IDBObjectStoreHelper,
// 	type DBSetting,
// 	type EssentialFields,
// 	type IndexSetting,
// 	type OpenDBHandlers
// } from '$lib/idb-helpers';

// export type DBSettingFromDBSettings<T extends readonly DBSetting[]> = T[number];

// export type DBNameFromDBSettings<T extends readonly DBSetting[]> =
// 	DBSettingFromDBSettings<T>['dbName'];

// export type ObjectStoreNameFromDBSetting<T extends DBSetting> = T['objectStores'][number]['name'];

// export const createObjectStoreHelperFactory =
// 	<const DBSettingType extends DBSetting>(dbHelper: IDBDatabaseHelper) =>
// 	<RecordType extends EssentialFields>(
// 		storeName: ObjectStoreNameFromDBSetting<DBSettingType>
// 	): IDBObjectStoreHelper<RecordType> => {
// 		return new IDBObjectStoreHelper<RecordType>(dbHelper, storeName);
// 	};

// const createIndex = (store: IDBObjectStore) => (indexSetting: IndexSetting) => {
// 	const { name, keyPath, options } = indexSetting;

// 	if (store.indexNames.contains(name)) return;

// 	store.createIndex(name, keyPath, options);
// };

// export const initDB =
// 	<T1 extends readonly DBSetting[]>(dbSettings: T1) =>
// 	async <T2 extends DBSettingFromDBSettings<T1>>(
// 		dbName: DBNameFromDBSettings<T1>
// 	): Promise<IDBDatabaseHelper<T2>> => {
// 		const dbSetting = dbSettings.find((dbSetting) => dbSetting.dbName === dbName);

// 		if (!dbSetting) {
// 			throw new Error(`Database setting for ${dbName} not found!`);
// 		}

// 		const { objectStores, dbVersion } = dbSetting;

// 		const openDBHandler: OpenDBHandlers = {
// 			onupgradeneeded: (event: IDBVersionChangeEvent) => {
// 				const db = (event.target as IDBOpenDBRequest).result;
// 				objectStores.forEach((store) => {
// 					let objectStore: IDBObjectStore;

// 					if (!db.objectStoreNames.contains(store.name)) {
// 						objectStore = db.createObjectStore(store.name, store.options);
// 					} else {
// 						const transaction = db.transaction(store.name);
// 						objectStore = transaction.objectStore(store.name);
// 					}

// 					store.indexes?.forEach(createIndex(objectStore));
// 				});
// 			},
// 			onblocked: () => {
// 				const reloadOK = window.confirm(
// 					'Database version change is blocked, please reload the page to continue.'
// 				);

// 				if (reloadOK) {
// 					window.location.reload();
// 				}
// 			}
// 		};

// 		const dbHelper = new IDBDatabaseHelper<T2>(dbName, dbVersion, openDBHandler);

// 		const db = await dbHelper.init();

// 		db.onversionchange = () => {
// 			db.close();
// 			alert('A new version of this page is ready, please reload or close this tab!');
// 		};

// 		return dbHelper;
// 	};
