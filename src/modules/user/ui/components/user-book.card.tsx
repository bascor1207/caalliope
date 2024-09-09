import { Image } from '@nextui-org/react';

import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { FC } from 'react';

import { CustomCard } from '@/modules/app/ui/component-level/custom.card';


type UserBookCardProps = {
    book: UsersModel.ToReadBook | UsersModel.InProgressBook | UsersModel.AlreadyReadBook | UsersModel.AbandonedBook | UsersModel.WishBook | UsersModel.BaseUserBook;
}



export const UserBookCard: FC<UserBookCardProps> = ({ book }) => {
    return (
        <CustomCard
            className='max-w-full'
            title={book.title}
            description={book.type}
            content={() => (
                <Image
                    removeWrapper
                    isZoomed={true}
                    radius='none'
                    src={book.image}
                    alt='livre'
                    className='w-full h-full object-cover'
                />
            )}
            footer={(() => (
                <span>{book.status}</span>
            ))}
            cover={true}
        />
    )
}
