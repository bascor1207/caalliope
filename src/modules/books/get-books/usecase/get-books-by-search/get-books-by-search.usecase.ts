import {createAppAsyncThunk} from "@/modules/store/create-app-thunk";

export const getBooksBySearchUseCase = createAppAsyncThunk(
    'getBooksBySearch',
    async (search: string, { getState, dispatch, extra: { getBooksAdapter } }) => {
        try {
            return await getBooksAdapter.getBooksBySearch(search);
        }
        catch (error) {
            console.error(error);
        }
    }
);