import {createSlice} from "@reduxjs/toolkit";
import {getBooksUseCase} from "../usecase/get-books.usecase";

type Book = {
    author: string;
    type: string;
    subject: string;
    dateOfPublication: string;
    image: string;
}

type InitialState = {
    books: Book[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const getBooksSlice = createSlice( {
    name: 'getBooks',
    initialState: { books: [], pendingRequest: false, rejectedRequest: false } as GetBooksSliceType,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getBooksUseCase.pending, (state, action) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getBooksUseCase.rejected, (state, action) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                state.books = action.payload;
            }
            state.pendingRequest = false;
        })
    }
});
