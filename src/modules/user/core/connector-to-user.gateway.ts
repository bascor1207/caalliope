import type { UsersModel } from '@/modules/user/core/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id }: {id: string; }): Promise<UsersModel.User | void>
    addBookToUserLibrary({ userId, bookId, status }: { userId: string, bookId: number, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<void>
    updateUserBookStatus({ userId, bookId, status }: { userId: string, bookId: number, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<void>
}
