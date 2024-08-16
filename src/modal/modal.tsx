import React, { FunctionComponent, useEffect } from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button';
import { DialogBody } from '@/components/ui/dialog-responsive';
export interface ModalProps {
    isShown: boolean;
    hideModal: () => void;
    modalContent: JSX.Element;
    modalDesc?: string;
    modalTitle?: string;
    modalFooter?: JSX.Element;
}

export const Modal: FunctionComponent<ModalProps> = ({ isShown, hideModal, modalContent, modalDesc, modalTitle, modalFooter }) => {
    return (
        <Dialog open={isShown}>
            <DialogContent className='bg-custom-grey'>
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                    <DialogDescription>
                        {modalDesc}
                    </DialogDescription>
                </DialogHeader>
                <DialogBody className='pb-4 space-y-4 text-sm text-center sm:pb-0 sm:text-left'>
                    {modalContent}
                </DialogBody>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline' onClick={hideModal}>Close</Button>
                    </DialogClose>
                    {modalFooter}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
