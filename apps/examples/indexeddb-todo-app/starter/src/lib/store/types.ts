// import type {
// 	EssentialFields,
// 	ObjectStoreOperationResult,
// 	WriteOperationResult
// } from '$lib/idb-helpers';

// export type StoreOperation = () => WriteOperationResult;

// export type StoreWriteOperationResult = Promise<ObjectStoreOperationResult>;

// export interface ReturnCreateStoreFn<
// 	SvelteStoreType,
// 	ModifiableDataFields extends Record<string, any>,
// 	FieldNamesRequiredWhenAddingData extends keyof ModifiableDataFields = keyof ModifiableDataFields
// > {
// 	store: SvelteStoreType;
// 	add: (
// 		newData: Required<Pick<ModifiableDataFields, FieldNamesRequiredWhenAddingData>>
// 	) => StoreWriteOperationResult;
// 	remove: (id: string) => StoreWriteOperationResult;
// 	update: (id: string, newData: Partial<ModifiableDataFields>) => StoreWriteOperationResult;
// }

// export interface StoreMethods<StoreDataType extends EssentialFields> {
// 	add(item: Partial<StoreDataType>): StoreOperation;

// 	remove(id: StoreDataType['id']): StoreOperation;

// 	update(id: StoreDataType['id'], updateItem: Partial<StoreDataType>): StoreOperation;
// }
