import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { ConnectorToAdminGateway } from '@/modules/user/usecases/admin/core/connector-to-admin.gateway';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserFactory } from '@/modules/user/core/model/user.factory';

export class FakeAdminGateway implements ConnectorToAdminGateway {
    bookId!: number;
    userRole!: 'admin' | 'user' | Array<'admin' | 'user'>;
    books!: Map<number, UsersModel.AdminBook>;

    constructor() {
        this.setUpBooks();
    }

    async updateBookStatus({ status }: { status: 'refused' | 'accepted' }): Promise<UsersModel.UpdateBookStatusResponse> {
        return new Promise((resolve) => {
            if (!this.bookId) {
                CustomErrorWrapper.throwError({ message: 'The book has no ID to update', type: 'error' });
            }
            if (this.userRole !== 'admin') {
                CustomErrorWrapper.throwError({ message: 'You are not an admin, please contact an admin', type: 'error' });
            }
            const book= this.books.get(this.bookId);
            if (!book) {
                CustomErrorWrapper.throwError({ message: 'No book found with this ID', type: 'error' });
                return;
            }
            book.status = status;
            if (this.books.get(book.id)?.status !== 'waiting') {
                resolve({ message: 'Book status updated', type: 'success' });
            }
            CustomErrorWrapper.throwError({ message: 'Error updating book status' });
        });
    }


    private setUpBooks() {
        const books = [UserFactory.createAdminBook(), UserFactory.createAdminBook({ id: 3 }), UserFactory.createAdminBook({ id: 2 }) ];
        this.books = new Map(books.map((book) => [book.id, book]));
    }
}
