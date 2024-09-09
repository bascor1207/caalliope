import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
 ZodString, ZodNumber, ZodBoolean, ZodDate, ZodOptional, ZodEnum
} from 'zod';

import type { AppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';
import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type React from 'react';
import type { ControllerRenderProps, DefaultValues, FieldValues } from 'react-hook-form';
import type { ZodObject, ZodType } from 'zod';

type UseCustomFormProps<TFormValues extends FieldValues, RType = void, A = void> = {
    schema: ZodObject<TFormValues>;
    action?: any | AppAsyncThunk<RType, A>;
    dispatch: (data: any | AppAsyncThunk<RType, A>) => ReturnType<AppDispatch>
    onCustomClose?: () => void;
}

export function useCustomForm<TFormValues extends FieldValues, RType, A>({ schema, action, dispatch, onCustomClose }: UseCustomFormProps<TFormValues, RType, A> ) {
    function isRequired(key: string) {
        return !(schema.shape[key] instanceof ZodOptional)
    }

    function isSubmittable() {
        return Object.values(errors).every((error) => error === undefined)
    }

    const handleChange = (field: ControllerRenderProps<TFormValues>, itemType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value;
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
            dispatch(action(data));
        }
        onCustomClose?.()
    }

    function onClose() {
        clearErrors()
        onCustomClose?.();
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
        clearErrors
    } = useForm<TFormValues>({
        resolver: zodResolver(schema),
        defaultValues: generateDefaultValues()
    });

    return { isSubmittable, isRequired, handleSelectChange, handleChange, control, handleSubmit, errors, onSubmit, resetField, props, classNames, onClose }

}
