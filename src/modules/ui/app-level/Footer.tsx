import { useTranslation } from 'react-i18next';
import styles from './Footer.module.scss';

export const Footer = () => {
    const { t } = useTranslation('footer');
    return (
        <footer className={styles.container}>
            <div className={styles.footerContent}>
                <a className={styles.donation} href='/'>{ t('donation') }</a>
                <a className={styles.contact} href='/'>{ t('contact') }</a>
            </div>
        </footer>
    )
}
