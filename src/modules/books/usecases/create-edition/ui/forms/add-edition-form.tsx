import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-edition.usecase';
import { selectCreateEditionForm } from '@/modules/books/usecases/create-edition/core/store/create-edition.selectors';
import { createEditionForm } from '@/modules/books/usecases/create-edition/core/store/create-edition.slice';

export const AddEditionForm: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const createEditionFormStatus = useAppSelector(selectCreateEditionForm)

    const formItems = [
        { id: 'isbn', name: 'isbn', label: t('form.isbn'), type: 'string' },
        { id: 'date', name: 'date', label: t('form.releaseDate'), type: 'date' },
        { id: 'editor', name: 'editor', label: t('form.editor'), type: 'string' },
        { id: 'translator', name: 'translator', label: t('form.translator'), type: 'string' },
        { id: 'nbPage', name: 'nbPage', label: t('form.numberOfPages'), type: 'number' },
        { id: 'language', name: 'language', label: t('form.language'), type: 'string' },
        {
            id: 'format', name: 'format', label: t('form.format'), type: 'select', options: [
                { value: 'paper', label: t('form.book') },
                { value: 'ebook', label: t('form.ebook') },
                { value: 'audio', label: t('form.audio') }
            ]
        },
    ] satisfies  Array<{id: string, name: keyof BooksModel.AddBookEditionForm, label: string, type: string, options?: {value: string, label: string}[]}>;

    return (
            <CustomForm
                items={formItems}
                schema={BooksModel.addBookEditionFormSchema}
                formType='modal'
                action={createEditionUsecase}
                modalTitle={t('form.addEdition')}
                visibilityTrigger={createEditionFormStatus === 'displayed'}
                onCustomClose={() => dispatch(createEditionForm('hidden'))}
            />
    );
};
