import React from 'react';
import { Controller } from 'react-hook-form';
import { useFormViewmodel } from '@/modules/books/forms/form.viewmodel';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';

interface AddBookFormProps {
    viewmodel: ReturnType<typeof useFormViewmodel>;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ viewmodel }) => {
    const formatOptions = [
        { value: 'Paper', label:'paper' },
        { value: 'Ebook', label:'ebook' },
        { value: 'Audio', label:'audio' }
    ]

    return (
        <form onSubmit={viewmodel.handleSubmit(viewmodel.onSubmit)} className='space-y-4'>
            <div>
                <Controller
                    name='isbn'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='ISBN' id='isbn' {...field} />
                    )}
                />
                {viewmodel.errors.isbn && <p className='text-red-500'>{viewmodel.errors.isbn.message}</p>}
            </div>

            <div>
                <Controller
                    name='title'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='Title' id='title' {...field} />
                    )}
                />
                {viewmodel.errors.title && <p className='text-red-500'>{viewmodel.errors.title.message}</p>}
            </div>

            <div>
                <Controller
                    name='author'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='Author' id='author' {...field} />
                    )}
                />
                {viewmodel.errors.author && <p className='text-red-500'>{viewmodel.errors.author.message}</p>}
            </div>

            <div>
                <Controller
                    name='date'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input
                            label='Release Date' type='date' id='date'
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        />
                    )}
                />
                {viewmodel.errors.date && <p className='text-red-500'>{viewmodel.errors.date?.message}</p>}
            </div>

            <div>
                <Controller
                    name='editor'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='Editor' id='editor' {...field} />
                    )}
                />
                {viewmodel.errors.editor && <p className='text-red-500'>{viewmodel.errors.editor.message}</p>}
            </div>

            <div>
                <Controller
                    name='translator'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='Translator' id='translator' {...field} />
                    )}
                    rules={{ required: false }}
                />
                {viewmodel.errors.translator && <p className='text-red-500'>{viewmodel.errors.translator?.message}</p>}
            </div>

            <div>
                <Controller
                    name='nbPage'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input
                            label='Number of Pages' type='number' id='nbPage'
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                    )}
                />
                {viewmodel.errors.nbPage && <p className='text-red-500'>{viewmodel.errors.nbPage.message}</p>}
            </div>

            <div>
                <Controller
                    name='language'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input label='Language' id='language' {...field} />
                    )}
                    rules={{ required: false }}
                />
                {viewmodel.errors.language && <p className='text-red-500'>{viewmodel.errors.language?.message}</p>}
            </div>

            <div>
                <Controller
                    name='format'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Select
                            className='bg-custom-grey w-1/4'
                            labelPlacement='inside'
                            size='sm'
                            radius='sm'
                            placeholder='Select a format'
                            {...field}
                        >
                            {formatOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.label} >
                                        {option.value}
                                    </SelectItem>
                                ))}
                        </Select>
                    )}
                />
                {viewmodel.errors.format && <p className='text-red-500'>{viewmodel.errors.format.message}</p>}
            </div>

            <div>
                <Controller
                    name='cover'
                    control={viewmodel.control}
                    render={({ field }) => (
                        <Input
                            label='Cover Image' type='file' id='cover' onChange={(e) => field.onChange(e.target.files?.[0])}
                            accept='image/png, image/jpeg'
                        />
                    )}
                    rules={{ required: false }}
                />
                {viewmodel.errors.cover && <p className='text-red-500'>{viewmodel.errors.cover.message}</p>}
            </div>
        </form>
    );
};

export const AddBookFormFooter: React.FC<AddBookFormProps> = ({ viewmodel }) => {
    return (
        <Button type='submit' onClick={viewmodel.handleSubmit(viewmodel.onSubmit)}>Submit</Button>
    )
}
