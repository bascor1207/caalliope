import { Spinner } from '@nextui-org/react';

export const CustomSpinner = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-custom-grey bg-opacity-50 z-50'>
            <Spinner size='lg' color='secondary' />
        </div>
    );
}
