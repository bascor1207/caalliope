'use client';

import { Button, Link } from '@nextui-org/react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { contactUs } from '@/modules/user/core/store/user.slice';

export default function Error() {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-3xl font-bold text-red-600'>{"Oups! Une erreur s'est produite"}</h1>
            <p className='mt-2 text-lg text-gray-600'>
                Désolé, une erreur est survenue. Veuillez réessayer plus tard.
            </p>
            <Button as={Link} href={'/'} className='bg-custom-purple m-6'> {"Retour à l'accueil"}</Button>
            <Button onPress={() => dispatch(contactUs('displayed'))} className='bg-custom-purple m-6'> Nous contacter</Button>
        </div>
    );
}
