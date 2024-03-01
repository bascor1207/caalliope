import {getOneBookViewmodel} from "@/modules/books/get-one-book/ui/get-one-book.viewmodel";
import {useSelector} from "react-redux";

export const Book = () => {
    const viewmodel = useSelector(getOneBookViewmodel());

    const nodeToRender = (() => {
        switch (viewmodel.type) {
            case "pending":
                return <div>LOADING....</div>;
            case "fulfilled":
                return <div>{viewmodel.selectedBook.author}</div>
        }
    })();

    return nodeToRender;
}
