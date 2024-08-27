import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';

export const getUsersUseCase = createAppAsyncThunk(
    'user/getUsers',
    async(_, { extra: { userAdapter } }) => {
        return await userAdapter.getUsers();
    }
)
