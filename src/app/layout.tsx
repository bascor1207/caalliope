import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {FC, PropsWithChildren} from "react";

import {AppWrapper} from "@/modules/AppWrapper";

import './globals.css'
import styles from './layout.module.scss';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}
const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          <div className={styles.container}>
            <div className={styles.child}>{children}</div>
          </div>
        </AppWrapper>
      </body>
    </html>
  )
}

export default RootLayout
