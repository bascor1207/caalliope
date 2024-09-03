import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getPopularBooksUseCase = createAppAsyncThunk(
    '/getPopularBooks',
    async(_, { extra: { getPopularBooksAdapter } }) => {
        return await getPopularBooksAdapter.getPopularBooks();
    }
)
