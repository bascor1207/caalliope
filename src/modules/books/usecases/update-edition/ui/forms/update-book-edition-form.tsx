import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';
import { selectUpdateEditionForm } from '@/modules/books/usecases/update-edition/core/store/update-edition.selectors';
import { updateEdition } from '@/modules/books/usecases/update-edition/core/store/update-edition.slice';

export const UpdateBookEditionModal: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const updateEditionFormStatus = useAppSelector(selectUpdateEditionForm)

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
        { id: 'cover', name: 'cover', label: t('form.cover'), type: 'file' }
    ] satisfies Array<{ id: string, name: keyof BooksModel.EditBookEditionForm, label: string, type: string, options?: { value: string, label: string }[] }>;

    return (
            <CustomForm
                modalTitle={t('form.editPublishing')}
                items={formItems}
                schema={BooksModel.editEditionFormSchema}
                formType='modal'
                onCustomClose={() => dispatch(updateEdition('hidden'))}
                visibilityTrigger={updateEditionFormStatus === 'displayed'}
            />
    );
};
