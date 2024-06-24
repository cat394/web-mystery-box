import type { StoreWriteOperationResult } from '$lib/idb-helpers/types';

export interface ReturnCreateStoreFn<
	SvelteStoreType,
	ModifiableDataFields extends Record<string, any>,
	FieldNamesRequiredWhenAddingData extends keyof ModifiableDataFields = keyof ModifiableDataFields
> {
	store: SvelteStoreType;
	add: (
		newData: Required<Pick<ModifiableDataFields, FieldNamesRequiredWhenAddingData>>
	) => StoreWriteOperationResult;
	remove: (id: string) => StoreWriteOperationResult;
	update: (id: string, newData: Partial<ModifiableDataFields>) => StoreWriteOperationResult;
}

