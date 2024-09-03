import type { UsersModel } from '@/modules/user/core/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id }: {id: string; }): Promise<UsersModel.User>
    addBookToUserLibrary({ userId, book, status }: { userId: string, book: UsersModel.BaseUserBook, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<void>
}
