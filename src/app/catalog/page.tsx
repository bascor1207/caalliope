'use client'
import {useEffect} from "react";
import {useDispatch} from "react-redux";


import {getBooksUseCase} from "../../modules/books/get-books/usecase/get-books.usecase";
import {AppDispatch} from "@/modules/store/create-store";
import { BooksCatalog } from "../../modules/books/get-books/ui/components/BooksCatalog";
import { Header } from "@/modules/ui/Header";

const CatalogPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getBooksUseCase({connectedUser: true}))
    }, []);

    return (
        <div>
            <BooksCatalog />
        </div>
    )
}

export default CatalogPage;
