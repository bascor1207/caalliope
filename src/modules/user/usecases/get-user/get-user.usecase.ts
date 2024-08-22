import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';

export const getUserUsecase = createAppAsyncThunk(
    'user/retrieve_user',
    async (data: GetUserPayload, { extra: { userAdapter } }) => {
        console.log('je passe ici et je suis un message très voyant', { ...data })
        return await userAdapter.getUser({ ...data })
    }
)

type GetUserPayload = {id: string, token?: string}
