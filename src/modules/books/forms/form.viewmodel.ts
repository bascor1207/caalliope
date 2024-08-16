import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BooksModel } from '@/modules/books/model/books.model';

export const useFormViewmodel = ({ hideModal }: {hideModal: () => void}) => {
    const onSubmit = () => {
        hideModal();
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<BooksModel.AddBookForm>({
        resolver: zodResolver(BooksModel.addBookFormSchema),
    });


    return { onSubmit, control, handleSubmit, errors }
}
