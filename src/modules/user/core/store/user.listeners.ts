import type { BooksModel } from '@/modules/books/model/books.model';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { authUser } from '@/modules/auth/usecases/auth.user'
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-edition.usecase';
import { updateBookUsecase } from '@/modules/books/usecases/update-book/core/update-book.usecase';
import { informUser } from '@/modules/user/core/store/user.slice';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';

const actionsToListen = [
    createBookUsecase.fulfilled.type,
    createBookUsecase.rejected.type,
    createEditionUsecase.fulfilled.type,
    createEditionUsecase.rejected.type,
    updateBookUsecase.fulfilled.type,
    updateBookUsecase.rejected.type,
];


export const registerOnAuthChangeForUserListener = () => {
   startAppListening({
        actionCreator: authUser.fulfilled,
        effect: async (action, { dispatch }) => {
            const { id } = action.payload as {id: string};
            dispatch(getUserUsecase({ id }))
        }
    })
}

export const registerOnUserActionToInformHim = () => {
    startAppListening({
        predicate: (action) => actionsToListen.includes(action.type),
        effect: async (action , { dispatch }) => {
            const { message, type } = action.payload as BooksModel.InformUser;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}

export const registerOnBookCreationForUserListener = () => {
    startAppListening({
        predicate: (action) =>
            action.type === createBookUsecase.fulfilled.type || action.type === createBookUsecase.rejected.type,
        effect: async (action, { dispatch }) => {
            const { message, type } = action.payload as BooksModel.InformUser;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}

export const registerOnEditionCreationForUserListener = () => {
    startAppListening({
        predicate: (action) =>
            action.type === createEditionUsecase.fulfilled.type || action.type === createEditionUsecase.rejected.type,
        effect: async (action, { dispatch }) => {
            const { message, type } = action.payload as BooksModel.InformUser;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}

export const registerOnBookUpdateForUserListener = () => {
    startAppListening({
        predicate: (action) =>
            action.type === updateBookUsecase.fulfilled.type || action.type === updateBookUsecase.rejected.type,
        effect: async (action, { dispatch }) => {
            const { message, type } = action.payload as BooksModel.InformUser;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
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
