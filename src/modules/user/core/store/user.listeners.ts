import { authUser } from '@/modules/auth/usecases/auth.user'
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { startAppListening } from '@/modules/app/core/store/create-app-listener';

export const registerOnAuthChangeForUserListener = () => {
   startAppListening({
        actionCreator: authUser.fulfilled,
        effect: async (action, { dispatch }) => {
            const { id } = action.payload;
            dispatch(getUserUsecase({ id: id.toString() }))
        }
    })
}
