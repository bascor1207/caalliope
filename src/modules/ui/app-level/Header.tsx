import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './Header.module.scss';
import { ChangeEvent } from 'react';


export const Header = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <Image src={'/logo.png'} alt='logo' width={160} height={50} />
            </div>
            <div className={styles.navbar}>
                <button className={styles.library}>{ t('navbar.library') }</button>
                <button className={styles.login}>{ t('navbar.login') }</button>
                <select className={styles.language} onChange={(e) => changeLanguage(e)} value={i18n.language}>
                    <option value='en'>English</option>
                    <option value='fr'>Français</option>
                </select>
            </div>
        </header>
    )
}
