import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Select, SelectItem, Card, CardBody } from '@nextui-org/react';
import { useAppSelector } from '@/modules/app/core/store/create-store';

import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { BooksModel } from '@/modules/books/model/books.model';
import { AddPublisherForm } from '@/modules/books/get-books/ui/forms/add-publisher-form';
import { UsersModel } from '@/modules/user/model/users.model';
import { AddBookToUserLibraryUseCase } from '@/modules/user/usecases/add-book-in-user-list/add-book-to-user-library.usecase';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { UnknownAction } from '@reduxjs/toolkit';

type Props = {
    book: BooksModel.Book;
}

export const PublishingSection: FC<Props> = ({ book }) => {
    const [isShown, setIsShown] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' | undefined>(undefined);
    const { t } = useTranslation('');
    const dispatch = useDispatch();
    const activeUser = useAppSelector(selectActiveUser);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned');
    };

    const handleClick = () => {
        if (selectedStatus) {
            const userBook: UsersModel.BaseUserBook = {
                id: book.id,
                title: book.title,
                type: book.type,
                image: book.image,
            };
            dispatch(AddBookToUserLibraryUseCase({ userId: activeUser.id, book: userBook, status: selectedStatus }) as unknown as UnknownAction);
            console.log(`Livre ajouté avec le statut : ${selectedStatus}`);
        } else {
            console.log('Aucun statut sélectionné');
        }
    };

    const toggle = () => {
        setIsShown(!isShown);
    };

    return (
        <div>
            <div className='flex items-start justify-between mb-4'>
                {book.publishers.map((publisher) => (
                    <Card key={publisher.id} className='bg-transparent text-black max-w-md flex-grow'>
                        <CardBody className='text-black'>
                            <span className='block mb-4'>
                                {publisher.dateOfPublication} - {publisher.label} | {publisher.language} | {publisher.numberOfPages} pages
                            </span>
                            <div className='flex items-center'>
                                <Select
                                    placeholder={t('selectOption')}
                                    className='text-black bg-red"'
                                    onChange={handleSelectChange}
                                >
                                    <SelectItem key='notOwned' value='notOwned'>{t('notOwned')}</SelectItem>
                                    <SelectItem key='inProgress' value='inProgress'>{t('inProgress')}</SelectItem>
                                    <SelectItem key='toRead' value='toRead'>{t('toRead')}</SelectItem>
                                    <SelectItem key='read' value='read'>{t('read')}</SelectItem>
                                    <SelectItem key='wishlist' value='wishlist'>{t('whislist')}</SelectItem>
                                    <SelectItem key='giveUp' value='giveUp'>{t('giveUp')}</SelectItem>
                                </Select>
                                <Button onClick={handleClick} className='ml-4 bg-[#D9D9D9] hover:bg-[#f8e9ff] text-black'>
                                    {t('valid')}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
                <Button onClick={toggle} className='bg-transparent hover:bg-[#f8e9ff] text-black underline'>
                    {t('library.addPublishing')}
                </Button>
            </div>
            <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddPublisherForm />} />
        </div>
    );
};
