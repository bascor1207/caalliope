import type { BooksModel } from '@/modules/books/model/books.model';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getOneBookById = createAppAsyncThunk(
    'getOneBookById',
    async (id: number, { rejectWithValue, extra: { getOneBookAdapter } }) => {
        try {
            const response = await getOneBookAdapter.getOneBookById(id) as BooksModel.Book;
            return response;
        }
        catch (error) {
            console.error(error);
            return rejectWithValue('error');
        }
    }
)
