import styles from './page.module.css'
import { Header } from '@/modules/core/ui/Header'
import { Footer } from '@/modules/core/ui/Footer'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.lastRelease}>
          <h1>Dernières sorties</h1>
        </div>
        <div className={styles.popularBook}>
          <h1>Livres du moment</h1>
        </div>
      </div>
      <div className={styles.footer}>
      <Footer />
      </div>
    </main>
  )
}
