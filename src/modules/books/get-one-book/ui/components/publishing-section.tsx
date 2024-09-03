import {
 Button, Select, SelectItem, Card, CardBody
} from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { AddPublisherForm } from '@/modules/books/usecases/get-catalog/ui/forms/add-publisher-form';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { addBookToUserLibraryUseCase } from '@/modules/user/usecases/add-book-in-user-list/add-book-to-user-library.usecase';


type Props = {
    book: BooksModel.Book;
}

export const PublishingSection: FC<Props> = ({ book }) => {
    const [isShown, setIsShown] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' | undefined>(undefined);
    const { t } = useTranslation('');
    const dispatch = useDispatch<AppDispatch>();
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
            dispatch(addBookToUserLibraryUseCase({ userId: activeUser.id, book: userBook, status: selectedStatus }));
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
