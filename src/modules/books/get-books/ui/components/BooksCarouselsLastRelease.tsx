'use client'
import styles from "@/modules/books/get-books/ui/components/books-carousels.module.scss";
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Carousel } from "react-responsive-carousel";
import { getBooksLastReleaseViewmodel } from "@/modules/books/get-books/ui/books-last-release-carousel/get-books-last-release.viewmodel";
import { BookCarouselCard } from "./BookCarouselCard";

export const BooksCarouselsLastRelease = () => {
  const viewmodel = useSelector(getBooksLastReleaseViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingBooksLastReleasePending':
              return <div>Loading...</div>;
          case 'gettingBooksLastReleaseRejected':
              return <div>Oops...</div>;
          case 'gettingBooksLastReleaseFulfilled':
              return (
                  <div className={styles.carousel}>
                    <Carousel>
                    {viewmodel.books.map((book) => {
                        console.log(book)
                        return (
                          <BookCarouselCard
                            key={book.id}
                            book={book}
                          />
                        );
                      })}
                    </Carousel>
                  </div>
              );
      }
  })();

  return nodeToRender;
}