import { Controller, Path } from 'react-hook-form';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useCustomForm } from '@/modules/ui/component-level/use-custom-form';
import { baseObjectOutputType, objectUtil,  ZodObject, ZodRawShape } from 'zod';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/modules/store/create-store';
import { useDispatch } from 'react-redux';
import React from 'react';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';
import addQuestionMarks = objectUtil.addQuestionMarks;

type optionalKeys<T extends object> = {
    [k in keyof T]: undefined extends T[k] ? k : never;
}[keyof T];
type requiredKeys<T extends object> = {
    [k in keyof T]: undefined extends T[k] ? never : k;
}[keyof T];

type ValidKeys<T extends ZodRawShape> = keyof T | requiredKeys<baseObjectOutputType<T>> | optionalKeys<baseObjectOutputType<T>>;

type EnsurePathCompatibility<T extends ZodRawShape> = ValidKeys<T> extends Path<{
    [k in keyof addQuestionMarks<baseObjectOutputType<T>, any>]: addQuestionMarks<baseObjectOutputType<T>, any>[k];
}> ? ValidKeys<T> : never;

type CustomFormProps<T extends ZodRawShape, A = void> = {
    items: { id: string; name: EnsurePathCompatibility<T>; label: string; type: string; options?: { value: string; label: string }[] }[];
    schema: ZodObject<T>;
    action?: UnknownAction | AppAsyncThunk<A>;
}

export const CustomForm = <T extends ZodRawShape, A>({ items, schema, action }: CustomFormProps<T, A>) => {
    const dispatch = useDispatch<AppDispatch>();
    const validator = useCustomForm({ schema, action, dispatch });

    const handleChange = (field: unknown, itemType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | number | Date | File | null;

        switch (itemType) {
            case 'number':
                value = parseInt(e.target.value, 10);
                break;
            case 'date':
                value = e.target.value ? new Date(e.target.value) : null;
                break;
            case 'file':
                value = e.target.files ? e.target.files[0] : null;
                break;
            case 'string':
            default:
                value = e.target.value;
                break;
        }

        if (typeof field === 'object' && field !== null && 'onChange' in field) {
            const fieldWithOnChange = field as { onChange: (changeValue: typeof value) => void };
            fieldWithOnChange.onChange(value);
        }
    };

    return (
        <form onSubmit={validator.handleSubmit(validator.onSubmit)} className='space-y-4'>
            {items.map((item) => (
                <div key={item.id}>
                    <Controller
                        name={item.name}
                        control={validator.control}
                        render={({ field }) => (
                            item.type === 'select' ? (
                                <Select {...field} label={item.label} classNames={validator.classNames} {...validator.props}>
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
                            ) : (
                                <Input
                                    classNames={validator.classNames}
                                    onClear={() => validator.resetField(field.name)}
                                    onChange={handleChange(field, item.type)}
                                    isRequired={true}
                                    label={item.label}
                                    id={item.id}
                                    {...validator.props}
                                    type={item.type}
                                />
                            )
                        )}
                    />
                    {validator.errors[item.name] && <p className='text-red-500'>{String(validator.errors[item.name]?.message)}</p>}
                </div>
            ))}
            <Button type='submit'>Submit</Button>
        </form>
    );
};
