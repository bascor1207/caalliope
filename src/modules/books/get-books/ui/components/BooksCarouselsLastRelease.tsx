'use client'
import { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { BookCarouselCard } from "./BookCarouselCard";
import { AppDispatch } from "@/modules/store/create-store";
import { getBooksLastReleaseUseCase } from "../../usecase/get-books-last-release/get-books-last-release.usecase";
import { getBooksLastReleaseViewmodel } from "@/modules/books/get-books/ui/books-last-release-carousel/get-books-last-release.viewmodel";

import 'swiper/css';
import 'swiper/css/pagination';
import styles from "@/modules/books/get-books/ui/components/books-carousels.module.scss";

export const BooksCarouselsLastRelease = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getBooksLastReleaseUseCase());
  }, []);

  const viewmodel = useSelector(getBooksLastReleaseViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingBooksLastReleasePending':
              return <div>Loading...</div>;
          case 'gettingBooksLastReleaseRejected':
              return <div>Oops...</div>;
          case 'gettingBooksLastReleaseFulfilled':
              return (
                  <div className={styles.carapuce}>
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
                        console.log("book", book)
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