import Image from 'next/image';
import logo from '../../../assets/images/logo.png';

import styles from './Header.module.scss';


export const Header = () => {
    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <Image src={logo} alt="logo" width={160} height={50} />
            </div>
            <div className={styles.navbar}>
                <a className={styles.library}>Bibliothèque</a>
                <a className={styles.login}>Se Connecter</a>
            </div>
        </header>
    )
}