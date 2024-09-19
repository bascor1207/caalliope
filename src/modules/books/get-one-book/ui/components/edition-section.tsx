import {
    Button, Select, SelectItem, Card, CardBody
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLocale } from '@/modules/app/core/store/root.selectors';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { createEditionForm } from '@/modules/books/usecases/create-edition/core/store/create-edition.slice';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { informUser } from '@/modules/user/core/store/user.slice';
import { addBookToUserLibraryUseCase } from '@/modules/user/usecases/add-book-in-user-list/add-book-to-user-library.usecase';

type Props = {
    book: BooksModel.Book;
}

export const EditionSection: FC<Props> = ({ book }) => {
    const { t } = useTranslation('');
    const dispatch = useDispatch<AppDispatch>();
    const activeUser = useAppSelector(selectActiveUser);
    const locale = useAppSelector(selectLocale);

    const handleClick = (key: string) => {
        if (key) {
            dispatch(addBookToUserLibraryUseCase({ userId: activeUser.id, bookId: book.id, status: key as 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }));
            return;
        }
        dispatch(informUser({ message: t('noStatusSelected'), type: 'error', status: 'displayed' }));
    };

    const toggle = () => {
        if (Object.keys(activeUser).length === 0) {
            dispatch(toggleAuthModal({ type: 'signIn', visible: true }));
            return;
        }
        dispatch(createEditionForm('displayed'));
    };

    const dateToString = (dateOfPublication: string) => {
       return new Date(dateOfPublication).toLocaleDateString(`${locale}-${locale.toUpperCase()}`, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className='space-y-8'>
            <div className='flex items-start justify-between mb-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow'>
                    {book.editions.map((publisher) => (
                        <Card key={publisher.id} className='bg-white shadow-md rounded-lg max-w-md'>
                            <CardBody className='text-black space-y-4 p-6'>
                                <div className='space-y-2'>
                                    <div className='text-sm'>
                                        <span className='text-gray-500'>{t('form.releaseDate')}:</span> {dateToString(publisher.dateOfPublication)}
                                    </div>
                                    <div className='text-sm'>
                                        <span className='text-gray-500'>{t('form.editor')}:</span> {publisher.label}
                                    </div>
                                    <div className='text-sm'>
                                        <span className='text-gray-500'>{t('form.language')}:</span> {publisher.language}
                                    </div>
                                    <div className='text-sm'>
                                        <span className='text-gray-500'>{t('form.numberOfPages')}:</span> {publisher.numberOfPages}
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <Select
                                        placeholder={t('selectOption')}
                                        className='w-full'
                                        onChange={(e) => handleClick(e.target.value)}
                                        defaultSelectedKeys={['notOwned']}
                                    >
                                        <SelectItem key='notOwned' value='notOwned'>{t('notOwned')}</SelectItem>
                                        <SelectItem key='reading' value='reading'>{t('inProgress')}</SelectItem>
                                        <SelectItem key='toRead' value='toRead'>{t('toRead')}</SelectItem>
                                        <SelectItem key='read' value='read'>{t('read')}</SelectItem>
                                        <SelectItem key='wishlist' value='wishlist'>{t('whislist')}</SelectItem>
                                        <SelectItem key='abandoned' value='abandoned'>{t('giveUp')}</SelectItem>
                                    </Select>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className='ml-6'>
                    <Button onPress={toggle} className='bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-300'>
                        {t('library.addPublishing')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
