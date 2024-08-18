import React, { FunctionComponent } from 'react';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

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
        <Modal isOpen={isShown} onClose={hideModal} className='bg-custom-grey' size='2xl'>
            <ModalContent>
                <>
                    <ModalHeader className='flex flex-col gap-1'>{modalTitle}</ModalHeader>
                    <ModalBody>
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
