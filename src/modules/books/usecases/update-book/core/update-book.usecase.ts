import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const updateBookUsecase = createAppAsyncThunk(
    'user-action/update-book',
    async (payload: BooksModel.EditBookForm, { rejectWithValue, extra:{ updateBookAdapter } }) => {
            try {
                return await updateBookAdapter.updateBook(payload)
            } catch (error) {
                if (error instanceof CustomErrorWrapper) {
                    return  rejectWithValue(error.payload)
                }
                return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
            }
})
