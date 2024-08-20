import { Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '@nextui-org/react';
import { useCustomForm } from '@/modules/ui/component-level/use-custom-form';
import { ZodSchema } from 'zod';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/modules/store/create-store';
import { useDispatch } from 'react-redux';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';


type CustomFormProps<T, A = void> = {
    items: {name: keyof T, id: string, label: string}[];
    schema: ZodSchema<T>
    action: UnknownAction | AppAsyncThunk<A>;
}

export const CustomForm= <T extends FieldValues, A>({ items, schema, action }: CustomFormProps<T, A>) => {
    const dispatch = useDispatch<AppDispatch>()
    const validator = useCustomForm(schema, action, dispatch);

    return (
        <form onSubmit={validator.handleSubmit(validator.onSubmit)} className='space-y-4'>
            {items.map((item) => (
                <div key={item.id}>
                    <Controller
                        name={item.name as Path<T>}
                        control={validator.control}
                        render={({ field }) => (
                            <Input
                                classNames={validator.classNames} onClear={() => validator.resetField(field.name)}
                                label={item.label} id={item.id} {...validator.props} {...field} />
                        )}
                    />
                    {validator.errors[item.name as keyof T] && <p className='text-red-500'>{String(validator.errors[item.name as keyof T]?.message)}</p>}
                </div>
            ))}
        </form>
    )
}
