import { Button, Link } from '@nextui-org/react';

export default function Forbidden() {
    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-4xl font-bold text-gray-800'>{"Action non autorisée, contactez l'administrateur"}</h1>
            <Button as={Link} href={'/'} className='bg-custom-purple m-6'> {"Retour à l'accueil"}</Button>
        </div>
    );
}
