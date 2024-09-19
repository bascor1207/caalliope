import {
 Button, Select, SelectItem, Card, CardBody
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
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

    const handleClick = (key: string) => {
        if (key) {
            dispatch(addBookToUserLibraryUseCase({ userId: activeUser.id, bookId: book.id, status: key as 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' }));
            return;
        }
        dispatch(informUser({ message: 'Aucun statut sélectionné', type: 'error', status: 'displayed' }));
    };

    const toggle = () => {
        if (Object.keys(activeUser).length === 0) {
            dispatch(toggleAuthModal({ type: 'signIn', visible: true }));
            return;
        }
        dispatch(createEditionForm('displayed'))
    };

    return (
        <div>
            <div className='flex items-start justify-between mb-4'>
                {book.editions.map((publisher) => (
                    <Card key={publisher.id} className='bg-transparent text-black max-w-md flex-grow'>
                        <CardBody className='text-black'>
                            <span className='block mb-4'>
                                {publisher.dateOfPublication} - {publisher.label} | {publisher.language} | {publisher.numberOfPages} pages
                            </span>
                            <div className='flex items-center'>
                                <Select
                                    placeholder={t('selectOption')}
                                    className='text-black bg-red"'
                                    onChange={(e) => handleClick(e.target.value)}
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
                <Button onPress={toggle} className='bg-transparent hover:bg-[#f8e9ff] text-black underline'>
                    {t('library.addPublishing')}
                </Button>
            </div>
        </div>
    );
};
