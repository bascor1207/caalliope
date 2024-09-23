import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const updateBookRatingUsecase = createAppAsyncThunk(
    'user-action/update-book-rating',
    async ({ payload }: { payload: { rating: number, bookId: number } }, { rejectWithValue, extra:{ updateBookAdapter } }) => {
            try {
                return await updateBookAdapter.updateBookRating(payload)
            } catch (error) {
                if (error instanceof CustomErrorWrapper) {
                    return  rejectWithValue(error.payload)
                }
                return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
            }
})
