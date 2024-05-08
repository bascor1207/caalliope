import styles from './page.module.scss'
import { Header } from '@/modules/ui/app-level/Header'
import { Footer } from '@/modules/ui/app-level/Footer'
import { BooksCarouselsLastRelease } from '@/modules/books/get-books/ui/components/BooksCarouselsLastRelease'
import { PopularBooksCarousels } from '@/modules/books/get-books/ui/components/PopularBooksCarousel'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.lastRelease}>
          <h1>Dernières sorties</h1>
          <BooksCarouselsLastRelease />
        </div>
        <div className={styles.popularBook}>
          <h1>Livres du moment</h1>
          <PopularBooksCarousels />
        </div>
      </div>
      <div className={styles.footer}>
      <Footer />
      </div>
    </main>
  )
}
