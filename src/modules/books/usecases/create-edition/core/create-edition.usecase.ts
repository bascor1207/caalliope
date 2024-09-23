import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const createEditionUsecase = createAppAsyncThunk(
    'books/create-edition',
    async ({ payload }:{payload: BooksModel.AddBookEditionForm}, { rejectWithValue, extra: { createEditionAdapter } }) => {
        try {
            return await createEditionAdapter.create(payload)
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return  rejectWithValue(error.payload)
            }
            return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
        }
    }
)
