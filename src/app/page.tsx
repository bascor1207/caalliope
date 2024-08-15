'use client'
import styles from './page.module.css'
import React from 'react';
import { Header } from '@/modules/ui/app-level/Header'
import { Footer } from '@/modules/ui/app-level/Footer'
import { BooksCarouselsLastRelease } from '../modules/books/get-books/ui/components/book-last-release'
import { PopularBooksCarousels } from '../modules/books/get-books/ui/components/book-popular'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation();
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.lastRelease}>
          <h1>{t('home.lastRelease')}</h1>
          <BooksCarouselsLastRelease />
        </div>
        <div className={styles.popularBook}>
          <h1>{t('home.popular')}</h1>
          <PopularBooksCarousels />
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </main>
  )
}
