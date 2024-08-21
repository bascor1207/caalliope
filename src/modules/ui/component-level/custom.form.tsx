'use client';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useCustomForm } from '@/modules/ui/component-level/use-custom-form';
import { ZodObject } from 'zod';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/modules/store/create-store';
import { useDispatch } from 'react-redux';
import React from 'react';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';

type CustomFormProps<TFormValues extends FieldValues, A = void> = {
    items: { id: string; name: Path<TFormValues>; label: string; type: string; options?: { value: string; label: string }[] }[];
    schema: ZodObject<TFormValues>;
    action?: UnknownAction | AppAsyncThunk<A>;
}

export const CustomForm = <TFormValues extends FieldValues, A>({ items, schema, action }: CustomFormProps<TFormValues, A>) => {
    const dispatch = useDispatch<AppDispatch>();
    const validator = useCustomForm({ schema , action, dispatch });


    return (
        <form onSubmit={validator.handleSubmit(validator.onSubmit)} className='space-y-4'>
            {items.map((item) => (
                <div key={item.id}>
                    <Controller
                        name={item.name}
                        control={validator.control}
                        render={({ field }) => {
                            if (item.type === 'select') {
                                console.log(field)
                                return (
                                    <Select
                                        label={item.label}
                                        classNames={validator.classNames}
                                        isRequired={validator.isRequired(item.id)}
                                        {...validator.props}
                                        onChange={validator.handleSelectChange(field)}
                                        selectedKeys={[field.value]}
                                    >
                                        {item.options ? (
                                            item.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div>{"Pas d'options"}</div>
                                        )}
                                    </Select>
                                );
                            }
                            if (item.type === 'date') {
                                const dateObject = new Date(field.value);
                                const isoDateString = dateObject.toISOString().split('T')[0];
                                return (
                                    <Input
                                        value={isoDateString}
                                        classNames={validator.classNames}
                                        onChange={validator.handleChange(field, item.type)}
                                        isRequired={validator.isRequired(item.id)}
                                        label={item.label}
                                        id={item.id}
                                        type='date'
                                        variant={validator.props.variant}
                                    />
                                )
                            }
                            return (
                                <Input
                                    defaultValue={field.value}
                                    value={field.value}
                                    classNames={validator.classNames}
                                    onClear={() => validator.resetField(field.name)}
                                    onChange={validator.handleChange(field, item.type)}
                                    isRequired={validator.isRequired(item.id)}
                                    label={item.label}
                                    id={item.id}
                                    {...validator.props}
                                    type={item.type}
                                />
                            );
                        }}
                    />
                    {validator.errors[item.name] && <p className='text-red-500'>{String(validator.errors[item.name]?.message)}</p>}
                </div>
            ))}
            <Button type='submit'>Submit</Button>
        </form>
    );
};
