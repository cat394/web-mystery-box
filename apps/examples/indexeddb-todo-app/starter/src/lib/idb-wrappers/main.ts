class IDBHelper {
	protected requestResult<SuccessReturnType>(request: IDBRequest): Promise<SuccessReturnType> {
		return new Promise((resolve, reject) => {
			request.onsuccess = (event: Event) => {
				const result = (event.target as IDBRequest).result;

				resolve(result);
			};

			request.onerror = (event: Event) => {
				const error = (event.target as IDBRequest).error as DOMException;

				reject(error);
			};
		});
	}
}