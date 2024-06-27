import type { IDBDatabaseHelper } from '$lib/idb-helpers';
import { db, todoAppDB } from './seed';

export async function getTodoAppDBHelper(): Promise<IDBDatabaseHelper<typeof todoAppDB>> {
	return await db<typeof todoAppDB>('todoApp');
}
