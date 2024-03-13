'use client'
import styles from "@/modules/books/get-books/ui/components/books-carousels.module.scss";
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Carousel } from "react-responsive-carousel";
import { BookCarouselCard } from "./BookCarouselCard";
import { getPopularBooksViewmodel } from "../popular-books-carousel/get-popular-books.viewmodel";

export const PopularBooksCarousels = () => {
  const viewmodel = useSelector(getPopularBooksViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingPopularBooksPending':
              return <div>Loading...</div>;
          case 'gettingPopularBooksRejected':
              return <div>Oops...</div>;
          case 'gettingPopularBooksFulfilled':
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