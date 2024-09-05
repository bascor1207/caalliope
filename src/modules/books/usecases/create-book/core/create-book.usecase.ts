import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const createBookUsecase = createAppAsyncThunk(
    'books/create-book',
    async (payload: BooksModel.AddBookFormSchemaType, { rejectWithValue, extra: { createBookAdapter } }) => {
        try {
            return await createBookAdapter.create(payload)
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return  rejectWithValue(error.payload)
            }
            return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
        }
    }
)
