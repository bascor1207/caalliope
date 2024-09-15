import { getServerStore } from '@/modules/app/core/store/server-store';
import { BookInfoPage } from '@/modules/books/get-one-book/ui/pages/book.page';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params;
    const store = getServerStore();

    await store.dispatch(getOneBookById(parseInt(id)));

    const bookDetails = store.getState().selectedBook.getBook.selectedBook;

    return {
        title: `Livre - ${bookDetails.title} de ${bookDetails.author.firstname} ${bookDetails.author.lastname}`,
        description: `Découvrez le livre ${bookDetails.title} de ${bookDetails.author} sur Caalliope.`,
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    };
}

export default async function BookPage() {
    const store = getServerStore();

    await store.dispatch(getOneBookById(parseInt('197')))

    return (
        <BookInfoPage />
    )
}
