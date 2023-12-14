import {RootState} from "@/modules/store/create-store";

const selectGetBooksState = (state: RootState) => ( state.catalog.getBooks);
export const getBooksViewModel = () => (state: RootState) => {
    const getBooksState = selectGetBooksState(state);
    const { pendingRequest, rejectedRequest, books } = getBooksState;
    if (pendingRequest) {
        return { pendingRequest };
    }
    if (rejectedRequest) {
        return { rejectedRequest };
    }
    return { books };
}
