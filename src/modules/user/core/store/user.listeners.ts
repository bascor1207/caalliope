import type { BooksModel } from '@/modules/books/model/books.model';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { authUser } from '@/modules/auth/usecases/auth.user'
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-edition.usecase';
import { updateBookUsecase } from '@/modules/books/usecases/update-book/core/update-book.usecase';
import { updateEditionUsecase } from '@/modules/books/usecases/update-edition/core/update-edition.usecase';
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
    updateEditionUsecase.fulfilled.type,
    updateEditionUsecase.rejected.type
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
