import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
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
    ];

    return (
            <CustomForm items={formItems} schema={BooksModel.addReviewFormSchema} />
    );
};