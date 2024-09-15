import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const getUserUsecase = createAppAsyncThunk(
    'user/retrieve_user',
    async (data: GetUserPayload, { rejectWithValue, extra: { userAdapter } }) => {
        try {
            return await userAdapter.getUser({ ...data })
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return rejectWithValue(error.payload)
            }
            return rejectWithValue({ message: 'Erreur inconnue', type: 'error' })
        }
    }
)

type GetUserPayload = { id: string }
