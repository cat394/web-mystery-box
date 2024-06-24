import {} from '$lib/idb-helpers';
import type { DataRecord, StoreWriteOperationResult } from '$lib/idb-helpers/types';

export interface EssentialFields extends DataRecord {
	id: string;
}

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
