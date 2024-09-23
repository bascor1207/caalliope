import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const addReviewUsecase = createAppAsyncThunk(
    'user/add-review',
    async (payload: { payload: { review: string }, bookId: number, userId: number}, { rejectWithValue, extra: { userAdapter } }) => {
        try {
            return await userAdapter.addReview(payload);
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                rejectWithValue(error.payload)
            }
            rejectWithValue({ message: 'Unexpected error occured.', type: 'error' });
        }
    }
);
