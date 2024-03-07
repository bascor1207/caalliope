import {createAppAsyncThunk} from "@/modules/store/create-app-thunk";

export const getBooksLastReleaseUseCase = createAppAsyncThunk(
    '/getBooksLastRelease',
    async(_, { extra: { getBooksAdapter } }) => {
        return await getBooksAdapter.getBooksLastRelease();
    }
)
