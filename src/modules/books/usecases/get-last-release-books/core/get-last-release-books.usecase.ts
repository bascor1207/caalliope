import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getBooksLastReleaseUseCase = createAppAsyncThunk(
    '/getBooksLastRelease',
    async(_, { extra: { getLastReleaseBooksAdapter } }) => {
        return await getLastReleaseBooksAdapter.getLastReleaseBooks();
    }
)
