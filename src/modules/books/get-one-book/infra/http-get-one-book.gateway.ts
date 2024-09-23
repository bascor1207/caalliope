import axios from 'axios';

import type { ConnectorToGetOneBook } from '@/modules/books/get-one-book/core/connector-to.get-one-book';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpGetOneBookGateway implements ConnectorToGetOneBook {

    constructor(private readonly translate: TFunction<never, never>) {}

    async getOneBookById(id: number): Promise<BooksModel.Book | void> {
        try {
            const { data } = await axiosInstance.get(`/book/${id}`)
            return await this.createReturnPayload(data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                CustomErrorWrapper.throwError({ message: error.message, type: 'error' });
            }

            CustomErrorWrapper.throwError({ message: this.translate('error.unknownError'), type: 'error' });
        }
    }

    private async createReturnPayload(data: BooksModel.GetBooksReturn): Promise<BooksModel.Book> {
        return {
            id: data.id || 0,
            title: data.title || this.translate('defaultValues.noTitleAvailable'),
            author: {
                lastname: data.author?.lastName || this.translate('defaultValues.unknownLastname'),
                firstname: data.author?.firstName || this.translate('defaultValues.unknownFirstname'),
                fullname: data.author?.fullName || this.translate('defaultValues.unknownFullname'),
                image: data.author?.image || '',
                email: data.author?.email || this.translate('defaultValues.emailNotAvailable'),
                birthDate: data.author?.birthDate ? new Date(data.author?.birthDate).toString() : this.translate('defaultValues.birthdateNotAvailable'),
            },
            type: data.publishing[0]?.format?.type || this.translate('defaultValues.typeNotProvided'),
            subjects: data.genre?.map((subject) => ({
                id: subject.id,
                label: subject.genre || this.translate('defaultValues.noSubjectProvided')
            })) || [],
            dateOfPublication: new Date(data.publicationDate).toISOString().split('T')[0] || this.translate('defaultValues.noPublicationDateAvailable'),
            image: data.cover?.filename && data.cover?.filename.includes('http') ? `${data.cover?.filename}` : `${process.env.NEXT_PUBLIC_COVERS_URL}/${data.cover?.filename}`,
            editions: data.publishing?.map((edition) => ({
                id: edition.id,
                label: edition.label || this.translate('defaultValues.noEditionProvided'),
                language: edition.language && edition.language !== 'undefined'
                    ? edition.language
                    : this.translate('defaultValues.noLanguageProvided'),
                numberOfPages: edition.numberOfPages || 1,
                dateOfPublication: edition.publicationDate || this.translate('defaultValues.noPublicationDateAvailable'),
            })) || [],
            rating: data.rating || undefined,
            summary: data.summary || this.translate('defaultValues.noSummaryAvailable'),
            reviews: data.comment?.map((review) => ({
                id: review.id,
                comment: review.content || this.translate('defaultValues.noCommentProvided'),
                date: new Date(review.createdAt)?.toString() || this.translate('defaultValues.noDateProvided'),
                reviewer: {
                    id: review.reviewer?.id || '',
                    avatar: review.reviewer?.avatar || '',
                    username: review.reviewer?.username || this.translate('defaultValues.unknownUsername'),
                }
            })) || [],
        };
    }

}
