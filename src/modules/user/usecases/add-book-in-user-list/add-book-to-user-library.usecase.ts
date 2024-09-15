import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';


export const addBookToUserLibraryUseCase = createAppAsyncThunk(
  'user/add_book_to_library',
  async ( data: AddBookToUserLibraryPayload, { extra: { userAdapter } }) => {
    const { userId, bookId, status } = data;
    return await userAdapter.addBookToUserLibrary({ userId, bookId, status });
  }
);

type AddBookToUserLibraryPayload = {
  userId: string;
  bookId: number;
  status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned';
};
