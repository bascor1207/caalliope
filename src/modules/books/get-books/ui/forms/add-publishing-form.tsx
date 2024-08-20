import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';

export const AddPublishingForm: FC = () => {
    const { t } = useTranslation();

    const formItems = [
        { id: 'isbn', name: 'isbn', label: t('form.isbn'), type: 'string', required: true },
        { id: 'date', name: 'date', label: t('form.releaseDate'), type: 'date', required: true },
        { id: 'editor', name: 'editor', label: t('form.editor'), type: 'string', required: true },
        { id: 'translator', name: 'translator', label: t('form.translator'), type: 'string' },
        { id: 'nbPage', name: 'nbPage', label: t('form.numberOfPages'), type: 'number', required: true },
        { id: 'language', name: 'language', label: t('form.language'), type: 'string' },
        {
            id: 'format', name: 'format', label: t('form.format'), type: 'select', options: [
                { value: 'paper', label: t('form.book') },
                { value: 'ebook', label: t('form.ebook') },
                { value: 'audio', label: t('form.audio') }
            ]
        },
        { id: 'cover', name: 'cover', label: t('form.cover'), type: 'file', accept: 'image/png, image/jpeg' }
    ];

    return (
            <CustomForm
                items={formItems}
                schema={BooksModel.addBookPublisherFormSchema}
            />
    );
};
