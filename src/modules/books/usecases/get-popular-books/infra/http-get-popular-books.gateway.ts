import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToPopularBooks } from '@/modules/books/usecases/get-popular-books/core/connector-to-popular-books.gateway';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';


export class HttpGetPopularBooksGateway implements ConnectorToPopularBooks {
    constructor(private readonly translate: TFunction<never, never>) {}

    async getPopularBooks(): Promise<BooksModel.Book[] | void> {
        try {
            const { data } = await axiosInstance.get('/book/getAll/popular');
            return await this.createReturnPayload(data.data);

        } catch (error) {
            console.log(error);
        }
    }

    private async createReturnPayload(data: BooksModel.GetBooksReturn[]): Promise<BooksModel.Book[]> {
        return data.map((book) => ({
            id: book.id || 0,
            title: book.title || this.translate('defaultValues.noTitleAvailable'),
            author: {
                lastname: book.author?.lastName || this.translate('defaultValues.unknownLastname'),
                firstname: book.author?.firstName || this.translate('defaultValues.unknownFirstname'),
                fullname: book.author?.fullName || this.translate('defaultValues.unknownFullname'),
                image: book.author?.image || '',
                email: book.author?.email || this.translate('defaultValues.emailNotAvailable'),
                birthDate: book.author?.birthDate ? new Date(book.author?.birthDate).toString() : this.translate('defaultValues.birthdateNotAvailable'),
            },
            type: book.publishing[0]?.format?.type || this.translate('defaultValues.typeNotProvided'),
            subjects: book.genre?.map((subject) => ({
                id: subject.id,
                label: subject.genre || this.translate('defaultValues.noSubjectProvided')
            })) || [],
            dateOfPublication: new Date(book.publicationDate).toISOString().split('T')[0] || this.translate('defaultValues.noPublicationDateAvailable'),
            image: book.cover?.filename && book.cover?.filename.includes('http') ? `${book.cover?.filename}` : `${process.env.NEXT_PUBLIC_COVERS_URL}/${book.cover?.filename}`,
            editions: book.publishing?.map((edition) => ({
                id: edition.id,
                label: edition.label || this.translate('defaultValues.noEditionProvided'),
                language: edition.language && edition.language !== 'undefined'
                    ? edition.language
                    : this.translate('defaultValues.noLanguageProvided'),
                numberOfPages: edition.numberOfPages || 1,
                dateOfPublication: edition.publicationDate || this.translate('defaultValues.noPublicationDateAvailable'),
            })) || [],
            rating: book.rating || undefined,
            summary: book.summary || this.translate('defaultValues.noSummaryAvailable'),
            reviews: book.comment?.map((review) => ({
                id: review.id,
                comment: review.content || this.translate('defaultValues.noCommentProvided'),
                date: new Date(review.createdAt)?.toString() || this.translate('defaultValues.noDateProvided'),
                reviewer: {
                    id: review.reviewer?.id || '',
                    avatar: review.reviewer?.avatar || '',
                    username: review.reviewer?.username || this.translate('defaultValues.unknownUsername'),
                }
            })) || [],
        }))
    }

}
