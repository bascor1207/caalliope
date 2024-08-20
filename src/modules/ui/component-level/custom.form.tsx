import { Controller, FieldValues, Path } from 'react-hook-form';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useCustomForm } from '@/modules/ui/component-level/use-custom-form';
import { ZodSchema } from 'zod';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/modules/store/create-store';
import { useDispatch } from 'react-redux';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';
import React from 'react';

type CustomFormProps<T extends FieldValues, A = void> = {
    items:{ id: string; name: string; label: string; type: string; options?: { value: string; label: string }[];} [];
    schema: ZodSchema<T>
    action?: UnknownAction | AppAsyncThunk<A>;
}

export const CustomForm= <T extends FieldValues, A>({ items, schema, action }: CustomFormProps<T, A>) => {
    const dispatch = useDispatch<AppDispatch>()
    const validator = useCustomForm({ schema, action, dispatch });

    return (
        <form onSubmit={validator.handleSubmit(validator.onSubmit)} className='space-y-4'>
            {items.map((item) => (
                <div key={item.id}>
                    <Controller
                        name={item.name as Path<T>}
                        control={validator.control}
                        render={({ field }) => (
                            item.type === 'select' ? (
                                <Select {...field} label={item.label} classNames={validator.classNames} {...validator.props}>
                                    {item.options ? (
                                        item.options.map((option) => (
                                        <SelectItem key={option.value} value={option.label}>
                                            {option.value}
                                        </SelectItem>
                                    ))
                                    ) : (
                                        <div>Pas d options</div>
                                    )}
                                </Select>
                                ) : (
                            <Input
                                classNames={validator.classNames} onClear={() => validator.resetField(field.name)}
                                label={item.label} id={item.id} {...validator.props} {...field} type={item.type} />
                        )
                        )}
                    />
                    {validator.errors[item.name as keyof T] && <p className='text-red-500'>{String(validator.errors[item.name as keyof T]?.message)}</p>}
                </div>
            ))}
        </form>
    )
}
