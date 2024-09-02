import type { FC, PropsWithChildren } from 'react';

export const CreateBookPage: FC<PropsWithChildren> = ({ children }) => {

    console.log('je passe ici')
    return (
        <div>
            {children}
        </div>
    )
}
