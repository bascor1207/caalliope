import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const createBookUsecase = createAppAsyncThunk(
    'books/create-book',
    async (payload: BooksModel.AddBookFormSchemaType, { rejectWithValue, extra: { createBookAdapter } }) => {
        try {
            return await createBookAdapter.create(payload)
        } catch (error) {
            error instanceof CustomErrorWrapper ? (
            rejectWithValue(error.payload)
            ) : (
                rejectWithValue({ message: 'Erreur inconnue' })
            )
        }
    }
)
