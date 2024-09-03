import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getBooksByUsecase = createAppAsyncThunk(
    'catalog/getBooksBy',
    async (payload: Payload, { extra: { getBooksAdapter } }) => {
        const methodName = methodMap[payload.type];
        return await getBooksAdapter[methodName].call(getBooksAdapter, payload.value);
    }
)

const methodMap: Record<Payload['type'], keyof ConnectorToGetBooks> = {
    genre: 'getBooksByGenre',
    author: 'getBooksByAuthor',
    name: 'getBooksByName',
};

type Payload = {
    type: 'genre' | 'author' | 'name';
    value: string;
}
