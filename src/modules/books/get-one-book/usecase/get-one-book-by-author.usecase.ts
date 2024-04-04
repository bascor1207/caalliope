import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';

export const getOneBookByAuthor = createAppAsyncThunk(
    'getBookByAuthor',
    async (authorName: string, { extra: { getOneBookAdapter } }) => {
        try {
            return await getOneBookAdapter.getOneBookByAuthor(authorName);
        }
        catch (error) {
            console.error(error)
        }
    }
)
