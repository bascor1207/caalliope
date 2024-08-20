import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { AppDispatch } from '@/modules/store/create-store';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';
import { ZodObject, ZodString, ZodNumber, ZodBoolean, ZodDate, ZodType, ZodOptional, ZodEnum } from 'zod';
import React from 'react';

type UseCustomFormProps<TFormValues extends FieldValues, A = void> = {
    schema: ZodObject<TFormValues>;
    action?: UnknownAction | AppAsyncThunk<A>;
    dispatch: (data: UnknownAction | AppAsyncThunk<A>) => ReturnType<AppDispatch>
}

export function useCustomForm<TFormValues extends FieldValues, A>({ schema, action, dispatch }: UseCustomFormProps<TFormValues, A> ) {
    function isRequired(key: string) {
        return !(schema.shape[key] instanceof ZodOptional)
    }

    const handleChange = (field: ControllerRenderProps<TFormValues>, itemType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | number | Date | File | null;
        switch (itemType) {
            case 'number':
                value = parseInt(e.target.value);
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

        field.onChange(value)
    };

    const handleSelectChange = (field: ControllerRenderProps<TFormValues>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        field.onChange(e.target.value)
    }

    function onSubmit(data: TFormValues) {
        console.log(data)
        reset()
        if (action) {
            dispatch(action);
        }
    }


    function generateDefaultValues(): DefaultValues<TFormValues> {
        const defaultValues: Partial<DefaultValues<TFormValues>> = {};

        for (const key in schema.shape) {
            const fieldSchema: ZodType = schema.shape[key];

            if (fieldSchema instanceof ZodEnum) {
                const enumValues = Object.values(fieldSchema.enum);
                defaultValues[key] = enumValues[0] as TFormValues[keyof TFormValues];
            } else if (fieldSchema instanceof ZodString) {
                defaultValues[key] = '' as TFormValues[keyof TFormValues];
            } else if (fieldSchema instanceof ZodNumber) {
                defaultValues[key] = 0 as TFormValues[keyof TFormValues];
            } else if (fieldSchema instanceof ZodBoolean) {
                defaultValues[key] = false as TFormValues[keyof TFormValues];
            } else if (fieldSchema instanceof ZodDate) {
                const isoStringDate = new Date().toISOString()
                defaultValues[key] = new Date(isoStringDate) as TFormValues[keyof TFormValues];
            } else {
                defaultValues[key] = undefined
            }
        }
        return defaultValues as DefaultValues<TFormValues>;
    }

    const classNames=
        {
            inputWrapper: 'border-custom-purple hover:border-custom-dark-purple', label: 'text-custom-dark-purple text-current',
            trigger: 'border-custom-purple hover:border-custom-dark-purple'
        }

    const props = {
        isClearable: true,
        variant: 'underlined',
    } as const

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm<TFormValues>({
        resolver: zodResolver(schema),
        defaultValues: generateDefaultValues()
    });

    return { isRequired, handleSelectChange, handleChange, control, handleSubmit, errors, onSubmit, resetField, props, classNames }

}
