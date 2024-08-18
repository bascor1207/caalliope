import { createPortal } from 'react-dom';
import { Spinner } from '@nextui-org/react';

export const CustomSpinner = () => {
    return createPortal(
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <Spinner size='md' color='default' />
        </div>,
        document.body
    );
}
