'use client'
import { FC, ReactNode } from 'react';
import { Card as NextUICard, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';

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
    cover: boolean
}

export const CustomCard: FC<CustomCardProps> = ({ title, content, footer, description, onClick, cover = false }) => {
    return cover ? (
        <NextUICard
            isPressable
            onPress={onClick}
            className='rounded-xl shadow  cursor-pointer'
        >
            {content()}
        </NextUICard>
        ) : (
        <NextUICard
            isPressable
            onPress={onClick}
            className='rounded-xl border shadow p-6 text-custom-dark-purple cursor-pointer bg-custom-purple h-full'
            classNames={{
                body: 'p-0'
            }}
        >

            {(title || description) && (
                <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                    <>
                        {title && (
                            <h3 className='text-2xl font-semibold leading-none tracking-tight'>
                                {title}
                            </h3>
                        )}
                        {description && (
                            <CardDescription description={description} />
                        )}
                    </>
                </CardHeader>
            )}

            <CardBody className='overflow-visible pt-4'>
                {content()}
            </CardBody>

            {footer && (
                <CardFooter className='flex flex-col gap-2 bg-white pt-4 min-h-[124px] rounded-b-xl'>
                    {footer()}
                </CardFooter>
            )}
        </NextUICard>
    );
};
