import BookInfoPage from '@/modules/books/get-one-book/ui/pages/book.page';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { ssrApp } from '@/modules/main.ssr';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params;
    const store = ssrApp.store;

    await store.dispatch(getOneBookById(parseInt(id)));

    const bookDetails = store.getState().selectedBook.getBook.selectedBook;

    return {
        title: `Livre - ${bookDetails.title} de ${bookDetails.author.firstname} ${bookDetails.author.lastname}`,
        description: `Découvrez le livre ${bookDetails.title} de ${bookDetails.author} sur Caalliope.`,
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    };
}

export default function BookPage() {

    return (
        <BookInfoPage />
    )
}
