import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const updateEditionUsecase = createAppAsyncThunk(
    'user-action/update-edition',
    async (payload: BooksModel.EditBookEditionForm, { rejectWithValue, extra:{ updateEditionAdapter } }) => {
            try {
                return await updateEditionAdapter.updateEdition(payload)
            } catch (error) {
                if (error instanceof CustomErrorWrapper) {
                    return  rejectWithValue(error.payload)
                }
                return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
            }
})
