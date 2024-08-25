import React from 'react';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';
import { useTranslation } from 'react-i18next';

export const AddBookForm: React.FC = () => {
    const { t } = useTranslation()

    const formItems = [
        { id: 'isbn', name: 'isbn', label: t('form.isbn'), type: 'text' },
        { id: 'title', name: 'title', label: t('form.title'), type: 'text' },
        { id: 'author', name: 'author', label: t('form.author'), type: 'text' },
        { id: 'date', name: 'date', label: t('form.releaseDate'), type: 'date' },
        { id: 'editor', name: 'editor', label: t('form.editor'), type: 'text' },
        { id: 'translator', name: 'translator', label: t('form.translator'), type: 'text' },
        { id: 'nbPage', name: 'nbPage', label: t('form.numberOfPages'), type: 'number' },
        { id: 'language', name: 'language', label: t('form.language'), type: 'text' },
        { id: 'format', name: 'format', label: t('form.format'), type: 'select', options: [
                { value: 'paper', label: t('form.book') },
                { value: 'ebook', label: t('form.ebook') },
                { value: 'audio', label: t('form.audio') }
            ] },
        { id: 'cover', name: 'cover', label: t('form.cover'), type: 'file' }
    ] satisfies Array<{id: string, name: keyof BooksModel.AddBookFormSchemaType, label: string, type: string, options?: {value: string, label: string}[]}>;

    return (
        <CustomForm
            items={formItems}
            schema={BooksModel.addBookFormSchema}
            formType='plain'
        />
    );
};
