import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

import i18n from '@/i18n';
import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpGetBooksGateway implements ConnectorToGetBooks {

    async getBooks(): Promise<BooksModel.Book[]> {
        const { data } =  await axiosInstance.get('/book');
        return data.map(({ data }: {data: BooksModel.GetBooksReturn}) => {
            return {
                id: data.id,
                title: data.title,
                author: {
                    lastname: data.author.lastname || i18n.t('No lastname known for this author'),
                    firstname: data.author.firstname || i18n.t('No lastname known for this author'),
                    image: data.author.image || '',
                    email: data.author.email || i18n.t('No email known for this author'),
                    birthDate: data.author.birthDate || i18n.t('No birthdate known for this author'),
                },
                type: data.type || '',
                subjects: data.subjects.map((subject) => (
                    {
                        id: subject.id || undefined,
                        label: subject.label || 'No subject provided'
                    }
                )) satisfies BooksModel.Subject[],
                dateOfPublication: data.publicationDate.toISOString(),
                image: data.image,
                editions: data.editions.map((edition) => (
                    {
                        id: edition.id || undefined,
                        label: edition.label || 'No edition provided',
                        language: edition.language || 'No language provided',
                        numberOfPages: edition.numberOfPages || 1,
                        dateOfPublication: edition.dateOfPublication || 'No publication date provided'
                    }
                )) satisfies BooksModel.Edition[],
                rating: data.rating,
                summary: data.summary,
                reviews:  data.reviews.map((review) => (
                    {
                        id: review.id || undefined,
                        comment: review.comment || 'No comment provided',
                        date: review.date || 'No date provided',
                        reviewer: {
                            id: review.reviewer.id,
                            avatar: review.reviewer.avatar || '',
                            username: review.reviewer.username || 'No username for this reviewer'
                        }
                    }
                )) satisfies BooksModel.Review[],
            }
        })
    }

    getBooksBySearch(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getLastReleaseBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getPopularBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }
}


