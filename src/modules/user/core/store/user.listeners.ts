import { authUser } from '@/modules/auth/usecases/auth.user'
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { informUser } from '@/modules/user/core/store/user.slice';

export const registerOnAuthChangeForUserListener = () => {
   startAppListening({
        actionCreator: authUser.fulfilled,
        effect: async (action, { dispatch }) => {
            const { id } = action.payload;
            dispatch(getUserUsecase({ id }))
        }
    })
}

export const registerOnBookCreationSuccessForUserListener = () => {
    startAppListening({
        actionCreator: createBookUsecase.fulfilled,
        effect: async (action, { dispatch }) => {
            dispatch(informUser({ message: action.payload.message, type: action.payload.type, status: 'displayed' }))
        }
    })
}

export const registerOnBookCreationErrorForUserListener = () => {
    startAppListening({
        actionCreator: createBookUsecase.rejected,
        effect: async (action, { dispatch }) => {
            const { message } = action.payload;
            console.log(action)
            dispatch(informUser({ message, type: 'error', status: 'displayed' }))
        }
    })
}
