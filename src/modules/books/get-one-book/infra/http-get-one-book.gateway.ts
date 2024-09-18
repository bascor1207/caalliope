import axios from 'axios';

import type { ConnectorToGetOneBook } from '@/modules/books/get-one-book/core/connector-to.get-one-book';
import type { BooksModel } from '@/modules/books/model/books.model';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpGetOneBookGateway implements ConnectorToGetOneBook {

    async getOneBookById(id: number): Promise<BooksModel.BookForCatalog | void> {
        try {
            const { data } = await axiosInstance.get(`/book/${id}`)
            return this.createReturnPayload(data.data);
        } catch (error) {
            console.log(error, error);
            if (axios.isAxiosError(error)) {
                CustomErrorWrapper.throwError({ message: error.message, type: 'error' });
            }
            CustomErrorWrapper.throwError({ message: 'Unknown error', type: 'error' });
        }
    }

    private createReturnPayload(data: BooksModel.GetBooksReturn): BooksModel.Book {
        return {
            id: data.id || 0,
            title: data.title || 'Title not available',
            author: {
                lastname: data.author?.lastName || 'Unknown lastname',
                firstname: data.author?.firstName || 'Unknown firstname',
                image: data.author?.image || '',
                email: data.author?.email || 'Email not available',
                birthDate: data.author?.birthDate ? new Date(data.author?.birthDate).toString() : 'Birthdate not available',
            },
            type: data.type || 'Type not provided',
            subjects: data.genre?.map((subject) => ({
                id: subject.id,
                label: subject.genre || 'No subject provided'
            })) || [],
            dateOfPublication: data.publicationDate ||'Publication date not available',
            image: data.cover.filename ? `${data.cover?.filename}` : '',
            editions: data.publishing?.map((edition) => ({
                id: edition.id,
                label: edition.label || 'No edition provided',
                language: edition.language || 'No language provided',
                numberOfPages: edition.numberOfPages || 1,
                dateOfPublication: edition.publicationDate || 'Publication date not available'
            })) || [],
            rating: data.rating || undefined,
            summary: data.summary || 'No summary available',
            reviews: data.comment?.map((review) => ({
                id: review.id,
                comment: review.content || 'No comment provided',
                date: new Date(review.createdAt)?.toString() || 'No date provided',
                reviewer: {
                    id: review.reviewer?.id || '',
                    avatar: review.reviewer?.avatar || '',
                    username: review.reviewer?.username || 'Unknown username'
                }
            })) || [],
        };
    }

}
