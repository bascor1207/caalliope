import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getBooksByUsecase = createAppAsyncThunk(
    'catalog/getBooksBy',
    async (payload: Payload, { rejectWithValue, extra: { getBooksAdapter } }) => {
        try {
            const methodName = methodMap[payload.type];
            return await getBooksAdapter[methodName].call(getBooksAdapter, payload.value);
        } catch(error) {
            if (error instanceof CustomErrorWrapper) {
                rejectWithValue(error.payload);
            } else {
                rejectWithValue({ message:'Error getting books', type: 'error' });
            }
        }
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
