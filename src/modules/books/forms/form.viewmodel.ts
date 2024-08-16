import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BooksModel } from '@/modules/books/model/books.model';

export const useFormViewmodel = ({ hideModal }: {hideModal: () => void}) => {
    const onSubmit = () => {
        hideModal()
        reset()
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<BooksModel.AddBookForm>({
        resolver: zodResolver(BooksModel.addBookFormSchema),
    });


    return { onSubmit, control, handleSubmit, errors }
}
