import type { IDBDatabaseManager } from '$lib/idb-wrappers';
import { db, todoAppDB } from './seed';

export async function getTodoAppDB(): Promise<IDBDatabaseManager<typeof todoAppDB>> {
	return await db<typeof todoAppDB>('todoApp');
}
