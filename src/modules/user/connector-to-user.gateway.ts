import { UsersModel } from '@/modules/user/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id, token }: { id: string; token?: string }): Promise<UsersModel.User>
    addBookToUserLibrary({ userId, book, status }: { userId: string, book: UsersModel.BaseUserBook, status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }): Promise<void>
}
