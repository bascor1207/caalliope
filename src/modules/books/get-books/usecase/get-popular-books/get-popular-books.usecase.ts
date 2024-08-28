import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getPopularBooksUseCase = createAppAsyncThunk(
    '/getPopularBooks',
    async(_, { extra: { getBooksAdapter } }) => {
        return await getBooksAdapter.getPopularBooks();
    }
)
