import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';


export const getBooksUseCase = createAppAsyncThunk(
    'catalog/getBooks',
    async(_, { extra: { getBooksAdapter } }) => {
        return await getBooksAdapter.getBooks();
    }
)