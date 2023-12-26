'use client'
import {useEffect} from "react";
import {useDispatch} from "react-redux";


import {getBooksUseCase} from "@/modules/catalog/get-books/get-books.usecase";
import {AppDispatch} from "@/modules/store/create-store";

import {BooksCatalog} from "@/modules/catalog/get-books/BooksCatalog";

const CatalogPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getBooksUseCase({connectedUser: true}))
    }, []);

    return (
        <BooksCatalog />
    )
}

export default CatalogPage;
