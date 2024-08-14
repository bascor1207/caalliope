import React, { FunctionComponent, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './modal.module.scss';
export interface ModalProps {
    isShown: boolean;
    hideModal: () => void;
    modalContent: JSX.Element;
}

export const Modal: FunctionComponent<ModalProps> = ({ isShown, hideModal, modalContent, ...rest }) => {
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 27 && isShown) {
            hideModal();
        }
    };

    useEffect(() => {
        isShown ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
        document.addEventListener('keydown', onKeyDown, false);
        return () => {
            document.removeEventListener('keydown', onKeyDown, false);
        };
    }, [isShown]);

    const modal = (
        <div className={styles.container}>
            <div className={styles.backdrop} onClick={hideModal} />
            <div className={styles.wrapper} aria-modal tabIndex={-1}>
                <div>{React.cloneElement(modalContent, rest)}</div>
            </div>
        </div>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};