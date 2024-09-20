import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { setLanguage } from '@/modules/app/core/store/root.slice';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

export const registerOnLanguageChangeForBookListener = () => {
    startAppListening({
        actionCreator: setLanguage,
        effect: async (action, { getState,dispatch }) => {
            const bookId = getState().selectedBook.getBook?.selectedBook?.id || null;
            if (bookId && action.payload.refresh) {
                dispatch(getOneBookById(bookId))
            }
            return;
        }
    })
}

export const registerOnDetailsModalDisplayedForBookListener = () => {
    startAppListening({
        actionCreator: bookDetailsModal,
        effect: async (action, { dispatch }) => {
            if (action.payload.status === 'displayed') {
                const { bookId } = action.payload;
                dispatch(getOneBookById(bookId))
            }
            return;
        }
    })
}
