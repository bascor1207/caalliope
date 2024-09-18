import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const updateUserBookUsecase = createAppAsyncThunk('' +
    'user/update-user-book',
    async ({ userId, bookId, status }: { userId: string, bookId: number, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }, { extra: { userAdapter } }) => {
    try {
        return await userAdapter.updateUserBookStatus({ userId, bookId, status });
    } catch (error) {
        console.log(error);
    }
});
