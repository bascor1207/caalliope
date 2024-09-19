import axios from 'axios';


import type { ConnectorToGetOneBook } from '@/modules/books/get-one-book/core/connector-to.get-one-book';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpGetOneBookGateway implements ConnectorToGetOneBook {

    constructor(private readonly translate: TFunction<any, any>) {}

    async getOneBookById(id: number): Promise<BooksModel.Book | void> {
        try {
            const { data } = await axiosInstance.get(`/book/${id}`)
            return await this.createReturnPayload(data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                CustomErrorWrapper.throwError({ message: error.message, type: 'error' });
            }
            console.error(error);
            CustomErrorWrapper.throwError({ message: 'Unknown error', type: 'error' });
        }
    }

    private async createReturnPayload(data: BooksModel.GetBooksReturn): Promise<BooksModel.Book> {
        return {
            id: data.id || 0,
            title: data.title || 'Title not available',
            author: {
                lastname: data.author?.lastName || 'Unknown lastname',
                firstname: data.author?.firstName || 'Unknown firstname',
                fullname: data.author?.fullName || 'Unknown fullname',
                image: data.author?.image || '',
                email: data.author?.email || 'Email not available',
                birthDate: data.author?.birthDate ? new Date(data.author?.birthDate).toString() : 'Birthdate not available',
            },
            type: data.publishing[0]?.format?.type || 'Type not provided',
            subjects: data.genre?.map((subject) => ({
                id: subject.id,
                label: subject.genre || 'No subject provided'
            })) || [],
            dateOfPublication: new Date(data.publicationDate).toISOString().split('T')[0] || 'No publication date available',
            image: data.cover?.filename && data.cover?.filename.includes('http') ? `${data.cover?.filename}` : `${process.env.NEXT_PUBLIC_COVERS_URL}/${data.cover?.filename}`,
            editions: data.publishing?.map((edition) => ({
                    id: edition.id,
                    label: edition.label || 'No edition provided',
                    language: edition.language && edition.language !== 'undefined'
                        ? edition.language
                        : this.translate('defaultValues.noLanguageProvided'),
                    numberOfPages: edition.numberOfPages || 1,
                    dateOfPublication: edition.publicationDate || 'Publication date not available',
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
                    username: review.reviewer?.username || 'Unknown username',
                }
            })) || [],
        };
    }

}
