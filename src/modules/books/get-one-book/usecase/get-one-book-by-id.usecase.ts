import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getOneBookById = createAppAsyncThunk(
    'getBookByAuthor',
    async (id: number, { extra: { getOneBookAdapter } }) => {
        try {
            return await getOneBookAdapter.getOneBookById(id);
        }
        catch (error) {
            console.error(error);
        }
    }
)
