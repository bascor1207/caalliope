'use client'
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { BookCarouselCard } from "./BookCarouselCard";
import { getPopularBooksViewmodel } from "../popular-books-carousel/get-popular-books.viewmodel";
import { getPopularBooksUseCase } from "../../usecase/get-popular-books/get-popular-books.usecase";
import { AppDispatch } from "@/modules/store/create-store";

import 'swiper/css';
import 'swiper/css/pagination';
import styles from "@/modules/books/get-books/ui/components/books-carousels.module.scss";

export const PopularBooksCarousels = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getPopularBooksUseCase);
  }, []);
  
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
                    <Swiper
                      slidesPerView={3}
                      spaceBetween={20}
                      freeMode={true}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[FreeMode, Pagination]}
                      className="mySwiper">
                      {viewmodel.books.map((book) => {
                          console.log(book)
                          return (
                            <BookCarouselCard
                              key={book.id}
                              book={book}
                            />
                          );
                        })}
                    </Swiper>
                  </div>
              );
      }
  })();

  return nodeToRender;
}