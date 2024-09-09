import { headers } from 'next/headers';

import { prefetchCatalogLayout } from '@/app/[locale]/catalog/prefetchCatalogLayout';
import { CatalogPage } from '@/modules/books/ui/pages/catalog.page';

export async function generateMetadata({ searchParams }: {searchParams?: { [key: string]: string | undefined }}) {
  const headersList = headers();
  const url = new URL(headersList.get('referer') || 'http://localhost:3000/catalog');
  const subject =  searchParams?.subject || 'Général'

  return {
    title: `Catalogue - ${subject}`,
    description: `Découvrez notre catalogue de ${subject} chez Caalliope`,
    icons: '/favico.png',
    metadataBase: url,
    openGraph: {
      title: `Catalogue - ${subject}`,
      description: `Découvrez notre catalogue de ${subject} chez Caalliope`,
      url: url.toString(),
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Logo Caalliope',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Catalogue - ${subject}`,
      description: `Découvrez notre catalogue de ${subject} chez Caalliope`,
      images: ['/logo.png'],
    },
  };
}

export default async function Page({ searchParams }:  {searchParams?: { [key: string]: string | undefined }}) {
  const { withQueryNode, withoutQueryNode, query } = await prefetchCatalogLayout({ searchParams })

  return (
      <CatalogPage withQueryNode={withQueryNode} withoutQueryNode={withoutQueryNode} query={query}/>
  )
}
