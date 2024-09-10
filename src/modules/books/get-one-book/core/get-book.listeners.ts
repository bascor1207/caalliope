import { startAppListening } from '@/modules/app/core/store/create-app-listener';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

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
