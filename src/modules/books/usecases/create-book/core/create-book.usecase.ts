import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';
import { BooksModel } from '@/modules/books/model/books.model';

export const createBookUsecase = createAppAsyncThunk(
    'books/create-book',
    async (payload: BooksModel.AddBookFormSchemaType, { rejectWithValue, extra: { createBookAdapter } }) => {
        try {
            return await createBookAdapter.create(payload)
        } catch (error) {
            console.log(error.payload);
            return rejectWithValue(error.payload)
        }
    }
)
