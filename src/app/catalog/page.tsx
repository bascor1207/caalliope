import { prefetchCatalogLayout } from '@/app/catalog/prefetchCatalogLayout';
import { CatalogPage } from '@/modules/books/ui/pages/catalog.page';


export default async function Page({ searchParams }:  {searchParams?: { [key: string]: string | undefined }}) {
  const { withQueryNode, withoutQueryNode, query } = await prefetchCatalogLayout({ searchParams })

  return (
      <CatalogPage withQueryNode={withQueryNode} withoutQueryNode={withoutQueryNode} query={query}/>
  )
}
