import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './Header.module.scss';


export const Header = () => {
    const { t } = useTranslation('navbar');
    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <Image src={"/logo.png"} alt="logo" width={160} height={50} />
            </div>
            <div className={styles.navbar}>
                <a className={styles.library}>{t('library')}</a>
                <a className={styles.login}>{t('login')}</a>
            </div>
        </header>
    )
}
