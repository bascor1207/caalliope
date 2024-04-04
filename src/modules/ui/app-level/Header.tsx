import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './Header.module.scss';


export const Header = () => {
    const { t, i18n } = useTranslation('navbar');
    
    const changeLanguage = (e: any) => {
        const selectedLanguage = e.target.value;
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <Image src={"/logo.png"} alt="logo" width={160} height={50} />
            </div>
            <div className={styles.navbar}>
                <a className={styles.library}>{t('library')}</a>
                <a className={styles.login}>{t('login')}</a>
                <select className={styles.language} onChange={changeLanguage} value={i18n.language}>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                </select>
            </div>
        </header>
    )
}
