import { authUser } from '@/modules/auth/usecases/auth.user'
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { AppListenerMiddlewareInstance } from '@/modules/store/create-store';
import { startAppListening } from '@/modules/store/create-app-listener';

export const registerOnAuthChangeForUserListener = () => {
   startAppListening({
        actionCreator: authUser.fulfilled,
        effect: async (action, { dispatch }) => {
            const { id, access_token } = action.payload;
            dispatch(getUserUsecase({ id: id.toString(), token: access_token }))
        }
    })
}
