import { useTranslation } from 'react-i18next';
import styles from './Footer.module.scss';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className={styles.container}>
            <div className={styles.footerContent}>
                <a className={styles.donation} href='/'>{ t('footer.donation') }</a>
                <a className={styles.contact} href='/'>{ t('footer.contact') }</a>
            </div>
        </footer>
    )
}
