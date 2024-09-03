
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';


export const addBookToUserLibraryUseCase = createAppAsyncThunk(
  'user/add_book_to_library',
  async ( data: AddBookToUserLibraryPayload, { extra: { userAdapter } }) => {
    const { userId, book, status } = data;
    return await userAdapter.addBookToUserLibrary({ userId, book, status });
  }
);

type AddBookToUserLibraryPayload = {
  userId: string;
  book: UsersModel.BaseUserBook;
  status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned';
};
