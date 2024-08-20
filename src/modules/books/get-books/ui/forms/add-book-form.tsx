import React from 'react';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { BooksModel } from '@/modules/books/model/books.model';
import { Button } from '@nextui-org/react';

export const AddBookForm: React.FC = () => {

    const formItems = [
        { id: 'isbn', name: 'isbn', label: 'ISBN', type: 'string' },
        { id: 'title', name: 'title', label: 'Title', type: 'string' },
        { id: 'author', name: 'author', label: 'Author', type: 'string' },
        { id: 'date', name: 'date', label: 'Release Date', type: 'date' },
        { id: 'editor', name: 'editor', label: 'Editor', type: 'string' },
        { id: 'translator', name: 'translator', label: 'Translator', type: 'string' },
        { id: 'nbPage', name: 'nbPage', label: 'Number of Pages', type: 'number' },
        { id: 'language', name: 'language', label: 'Language', type: 'string' },
        { id: 'format', name: 'format', label: 'Format', type: 'select', options: [
                { value: 'Paper', label: 'Paper' },
                { value: 'Ebook', label: 'Ebook' },
                { value: 'Audio', label: 'Audio' }
            ] },
        { id: 'cover', name: 'cover', label: 'Cover Image', type: 'file' }
    ];

    return (
        <CustomForm
            items={formItems}
            schema={BooksModel.addBookFormSchema}
        />
    );
};

export const AddBookFormFooter: React.FC<any> = ({ viewmodel }: any) => {
    return (
        <Button type='submit' onClick={viewmodel.handleSubmit(viewmodel.onSubmit)}>Submit</Button>
    )
}
