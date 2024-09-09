import { Button, Link } from '@nextui-org/react';

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-4xl font-bold text-gray-800'>404 - Page non trouvée</h1>
            <p className='mt-2 text-lg text-gray-600'>
                {"La page que vous cherchez n'existe pas ou a été déplacée."}
            </p>
            <Button as={Link} href={'/'} className='bg-custom-purple m-6'> {"Retour à l'accueil"}</Button>
        </div>
    );
}
