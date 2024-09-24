import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getBooksUseCase = createAppAsyncThunk(
    'catalog/getBooks',
    async(_, { rejectWithValue , extra: { getBooksAdapter } }) => {
        try {
            return await getBooksAdapter.getBooks();
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return rejectWithValue(error.payload)
            }
        }
    }
)
