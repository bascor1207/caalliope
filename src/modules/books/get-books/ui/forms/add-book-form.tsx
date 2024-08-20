import React from 'react';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export const AddBookForm: React.FC = () => {
    const { t } = useTranslation()

    const formItems = [
        { id: 'isbn', name: 'isbn', label: t('form.isbn'), type: 'string' },
        { id: 'title', name: 'title', label: t('form.title'), type: 'string' },
        { id: 'author', name: 'author', label: t('form.author'), type: 'string' },
        { id: 'date', name: 'date', label: t('form.releaseDate'), type: 'date' },
        { id: 'editor', name: 'editor', label: t('form.editor'), type: 'string' },
        { id: 'translator', name: 'translator', label: t('form.translator'), type: 'string' },
        { id: 'nbPage', name: 'nbPage', label: t('form.numberOfPages'), type: 'number' },
        { id: 'language', name: 'language', label: t('form.language'), type: 'string' },
        { id: 'format', name: 'format', label: t('form.format'), type: 'select', options: [
                { value: 'paper', label: t('form.book') },
                { value: 'ebook', label: t('form.ebook') },
                { value: 'audio', label: t('form.audio') }
            ] },
        { id: 'cover', name: 'cover', label: t('form.cover'), type: 'file' }
    ];

    return (
        <CustomForm
            items={formItems}
            schema={BooksModel.addBookFormSchema}
        />
    );
};

export const AddBookFormFooter: React.FC<any> = ({ viewmodel }: any) => {
    return (
        <Button type='submit' onClick={viewmodel.handleSubmit(viewmodel.onSubmit)}>Submit</Button>
    )
}
