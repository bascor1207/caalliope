import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';


export const getBooksUseCase = createAppAsyncThunk(
    'catalog/getBooks',
    async(/*data: RequiresToGetBooks*/_, { extra: { getBooksAdapter } }) => {
        return await getBooksAdapter.getBooks(/*data.connectedUser*/);
    }
)
