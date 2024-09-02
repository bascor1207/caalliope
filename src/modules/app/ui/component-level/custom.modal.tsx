import {
 Modal, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@nextui-org/react';
import React from 'react';

import type { FunctionComponent } from 'react';

export interface ModalProps {
    isShown: boolean;
    hideModal: () => void;
    modalContent: JSX.Element;
    modalDesc?: string;
    modalTitle?: string;
    modalFooter?: JSX.Element;
}

export const CustomModal: FunctionComponent<ModalProps> = ({ isShown, hideModal, modalContent, modalTitle, modalFooter }) => {
    return (
        <Modal isOpen={isShown} onClose={hideModal} className='bg-custom-grey' size='2xl' scrollBehavior='inside'>
            <ModalContent>
                <>
                    <ModalHeader className='rounded-t-[14px] flex items-center flex-col gap-1 bg-custom-purple text-custom-dark-purple'>{modalTitle}</ModalHeader>
                    <ModalBody className='max-h-[600px]'>
                        {modalContent}
                    </ModalBody>
                    <ModalFooter>
                        {modalFooter}
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
};
