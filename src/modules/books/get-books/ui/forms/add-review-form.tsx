import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';

export const AddReviewForm: FC = () => {
    const { t } = useTranslation();

    const formItems = [
        {
            id: 'review',
            name: 'review',
            label: t('library.yourReview'),
            type: 'string',
        },
    ] satisfies Array<{id: string, name: keyof BooksModel.AddReviewForm, label: string, type: string, options?: {value: string, label: string}[]}>;

    return (
            <CustomForm items={formItems} schema={BooksModel.addReviewFormSchema} formType='plain' />
    );
};
