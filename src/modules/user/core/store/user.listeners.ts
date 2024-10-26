import type { BooksModel } from '@/modules/books/model/books.model';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { authUser } from '@/modules/auth/usecases/auth.user'
import { registerUser } from '@/modules/auth/usecases/register.user';
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-edition.usecase';
import { updateBookUsecase } from '@/modules/books/usecases/update-book/core/update-book.usecase';
import { updateBookRatingUsecase } from '@/modules/books/usecases/update-book/update-book-rating.usecase';
import { updateEditionUsecase } from '@/modules/books/usecases/update-edition/core/update-edition.usecase';
import { informUser, showUserHeShouldWait } from '@/modules/user/core/store/user.slice';
import { addBookToUserLibraryUseCase } from '@/modules/user/usecases/add-book-in-user-list/add-book-to-user-library.usecase';
import { addReviewUsecase } from '@/modules/user/usecases/add-review/core/add-review.usecase';
import { sendCommentValidationUsecase } from '@/modules/user/usecases/admin/infra/send-comment-validation.usecase';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';
import { editProfileUsecase } from '@/modules/user/usecases/edit-profile/core/edit-profile.usecase';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';
import { updateUserBookUsecase } from '@/modules/user/usecases/update-user-book/update-user-book.usecase';

const actionsToListen = [
    createBookUsecase.fulfilled.type,
    createBookUsecase.rejected.type,
    createEditionUsecase.fulfilled.type,
    createEditionUsecase.rejected.type,
    updateBookUsecase.fulfilled.type,
    updateBookUsecase.rejected.type,
    updateEditionUsecase.fulfilled.type,
    updateEditionUsecase.rejected.type,
    getUserUsecase.rejected.type,
    editProfileUsecase.fulfilled.type,
    editProfileUsecase.rejected.type,
    updateBookStatusUsecase.fulfilled.type,
    updateBookStatusUsecase.rejected.type,
    sendCommentValidationUsecase.fulfilled.type,
    sendCommentValidationUsecase.rejected.type,
    updateUserBookUsecase.fulfilled.type,
    updateUserBookUsecase.rejected.type,
    addBookToUserLibraryUseCase.fulfilled.type,
    addBookToUserLibraryUseCase.rejected.type,
    updateBookRatingUsecase.fulfilled.type,
    updateBookRatingUsecase.rejected.type,
    addReviewUsecase.fulfilled.type,
    addReviewUsecase.rejected.type
];

const authActionsToListen = [
    authUser.rejected.type,
    registerUser.fulfilled.type,
    registerUser.rejected.type
];

const actionsThatNeedsToGetTheUser = [
    updateBookStatusUsecase.fulfilled.type,
    editProfileUsecase.fulfilled.type,
    sendCommentValidationUsecase.fulfilled.type,
    updateUserBookUsecase.fulfilled.type
];

const actionsThatNeedsToDisplaySpinner = [
    logoutUserUsecase.pending.type,
    editProfileUsecase.pending.type,
    updateBookStatusUsecase.pending.type,
    sendCommentValidationUsecase.pending.type
];

const actionsThatNeedsToHideSpinner = [
    logoutUserUsecase.fulfilled.type,
    logoutUserUsecase.rejected.type,
    editProfileUsecase.fulfilled.type,
    editProfileUsecase.rejected.type,
    updateBookStatusUsecase.fulfilled.type,
    updateBookStatusUsecase.rejected.type,
    sendCommentValidationUsecase.fulfilled.type,
    sendCommentValidationUsecase.rejected.type
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

export const registerOnUpdateBookStatusChangeToGetUserListener = () => {
    startAppListening({
        predicate: (action) => actionsThatNeedsToGetTheUser.includes(action.type),
        effect: async (_, { getState, dispatch }) => {
            const id = getState().user.getUser.activeUser.id;
            dispatch(getUserUsecase({ id }))
        }
    })
}

export const registerOnUserActionThatNeedsToDisplaySpinner = () => {
    startAppListening({
        predicate: (action) => actionsThatNeedsToDisplaySpinner.includes(action.type),
        effect: async (action, { dispatch }) => {
            dispatch(showUserHeShouldWait(true))
        }
    })
}

export const registerOnUserActionThatNeedsToHideSpinner = () => {
    startAppListening({
        predicate: (action) => actionsThatNeedsToHideSpinner.includes(action.type),
        effect: async (action, { dispatch }) => {
            dispatch(showUserHeShouldWait(false))
        }
    })
}

export const registerOnSignInOrSignUpForUserListener = () => {
    startAppListening({
        predicate: (action) => authActionsToListen.includes(action.type),
        effect: async (action, { dispatch }) => {
           dispatch(informUser({ message: 'Signed in', type: 'success', status: 'displayed' }))
        }
    })
}

export const registerOnUserActionToInformHim = () => {
    startAppListening({
        predicate: (action) => actionsToListen.includes(action.type),
        effect: async (action , { dispatch }) => {
            if (action.type === editProfileUsecase.fulfilled.type) {
                dispatch(informUser({ message: 'Profile updated', type: 'success', status: 'displayed' }))
                return;
            }
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
            const { message, type } = action.payload as UsersModel.UpdateBookStatusResponse;
            dispatch(informUser({ message: message, type, status: 'displayed' }))
        }
    })
}
