import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';

export const registerOnBookStatusChangeToRefreshAdminView = () => {
    startAppListening({
        actionCreator: updateBookStatusUsecase.fulfilled,
        effect: async (_, { getState, dispatch }) => {
            const userId = getState().user.getUser.activeUser.id;
            dispatch(getUserUsecase({ id: userId }))
        }
    })
}
