import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';

export const getUserUsecase = createAppAsyncThunk(
    'user/retrieve_user',
    async (id: string, { extra: { userAdapter } }) => {
        // console.log('je passe ici et je suis un message très voyant')
        return await userAdapter.getUser(id)
    }
)
