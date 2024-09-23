import type { UsersModel } from '@/modules/user/core/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id }: {id: string; }): Promise<UsersModel.User | void>
    addBookToUserLibrary({ userId, bookId, status }: { userId: string, bookId: number, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<UsersModel.UpdateBookStatusResponse | void>
    updateUserBookStatus({ userId, bookId, status }: { userId: string, bookId: number, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<UsersModel.UpdateBookStatusResponse | void>
    addReview({ userId, bookId, payload }: { userId: number, bookId: number, payload: { review: string } }): Promise<void>
}
