import styles from './Footer.module.scss';

export const Footer = () => {
    return (
        <footer className={styles.container}>
            <div className={styles.footerContent}>
                <a className={styles.donation} href="#">Faire un don</a>
                <a className={styles.contact} href="#">Nous Contacter</a>
            </div>
        </footer>
    )
}