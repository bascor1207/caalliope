import type { BooksModel } from '@/modules/books/model/books.model';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { authUser } from '@/modules/auth/usecases/auth.user'
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-editon.usecase';
import { informUser } from '@/modules/user/core/store/user.slice';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';

export const registerOnAuthChangeForUserListener = () => {
   startAppListening({
        actionCreator: authUser.fulfilled,
        effect: async (action, { dispatch }) => {
            const { id } = action.payload as {id: string};
            dispatch(getUserUsecase({ id }))
        }
    })
}

export const registerOnBookCreationSuccessForUserListener = () => {
    startAppListening({
        actionCreator: createBookUsecase.fulfilled,
        effect: async (action, { dispatch }) => {
            const { message } = action.payload as BooksModel.BookCreation;
            dispatch(informUser({ message: message, type: 'success', status: 'displayed' }))
        }
    })
}

export const registerOnBookCreationErrorForUserListener = () => {
    startAppListening({
        actionCreator: createBookUsecase.rejected,
        effect: async (action, { dispatch }) => {
            const { message } = action.payload as BooksModel.BookCreation;
            dispatch(informUser({ message, type: 'error', status: 'displayed' }))
        }
    })
}

export const registerOnEditionCreationSuccessForUserListener = () => {
    startAppListening({
        actionCreator: createEditionUsecase.fulfilled,
        effect: async (action, { dispatch }) => {
            const { message } = action.payload as BooksModel.BookCreation;
            dispatch(informUser({ message: message, type: 'success', status: 'displayed' }))
        }
    })
}

export const registerOnEditionCreationErrorForUserListener = () => {
    startAppListening({
        actionCreator: createEditionUsecase.rejected,
        effect: async (action, { dispatch }) => {
            const { message } = action.payload as BooksModel.BookCreation;
            dispatch(informUser({ message, type: 'error', status: 'displayed' }))
        }
    })
}

export const registerOnUpdatedBookStatusForUserListener = () => {
    startAppListening({
        actionCreator: updateBookStatusUsecase.fulfilled,
        effect: async (action, { dispatch }) => {
            const { message, type } = action.payload as UsersModel.UpdateBookStatusResponse;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}

export const registerOnUpdatedBookStatusErrorForUserListener = () => {
    startAppListening({
        actionCreator: updateBookStatusUsecase.rejected,
        effect: async (action, { dispatch }) => {
            console.log('updateBookStatusUsecase.rejected');
            const { message, type } = action.payload as UsersModel.UpdateBookStatusResponse;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}
