import type { UsersModel } from '@/modules/user/core/model/users.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const sendCommentValidationUsecase = createAppAsyncThunk(
    'admin/sendCommentValidation',
    async (payload: UsersModel.SendCommentValidationPayload, { rejectWithValue, extra: { adminAdapter } }) => {
        try {
            return await adminAdapter.sendCommentValidation(payload);
        }
        catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return rejectWithValue(error.payload);
            }
            return rejectWithValue({ message: 'Une erreur est survenue lors de la validation du commentaire', type: 'error' });
        }
    }
)
