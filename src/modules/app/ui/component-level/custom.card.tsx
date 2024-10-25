'use client'
import {
    Card as NextUICard, CardBody, CardFooter, CardHeader, Divider
} from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';

import type { FC, ReactNode } from 'react';

const CardText: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
    return (
        <p className={twMerge('text-muted-foreground', className)}>
            {children}
        </p>
    );
};

const CardDescription: FC<{ description: string }> = ({ description }) => {
    return (
        <CardText className='text-sm'>
            {description}
        </CardText>
    );
};


type CustomCardProps = {
    title?: string;
    content: () => ReactNode;
    footer?: () => ReactNode;
    description?: string;
    onClick?: () => void;
    cover?: boolean
    className?: string;
    isPressable?: boolean
    divider?: boolean;
}

export const CustomCard: FC<CustomCardProps> = (
    {
        title, content, footer, description,
        onClick, cover = false, className = '', isPressable = true, divider = false
    }
) => {
    return cover ? (
        <NextUICard
            isPressable
            onPress={onClick}
            className={twMerge('rounded-xl shadow  cursor-pointer aspect-[3/4]', className)}
            classNames={{ body: 'h-full' }}
        >
            {content()}
        </NextUICard>
        ) : (
        <NextUICard
            isPressable={isPressable}
            onClick={onClick}
            className={twMerge('rounded-xl border shadow p-6 text-custom-dark-purple cursor-pointer bg-custom-purple h-full', className)}
            classNames={{
                body: 'p-0'
            }}
        >

            {(title || description) && (
                <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                    <>
                        {title && (
                            <h3 className='text-2xl font-semibold truncate w-full'>
                                {title}
                            </h3>
                        )}
                        {description && (
                            <CardDescription description={description} />
                        )}
                    </>
                </CardHeader>
            )}

            {divider && (
                <div className='w-full px-4 my-4'>
                    <Divider className='bg-custom-dark-purple' />
                </div>
            )}

            <CardBody className={twMerge('flex-col items-start p-0 m-0', footer ? 'pb-4' : 'pb-0')}>
                {content()}
            </CardBody>

            {footer && (
                <CardFooter className='flex flex-col gap-2 bg-white rounded-b-xl'>
                    {footer()}
                </CardFooter>
            )}
        </NextUICard>
    );
};
