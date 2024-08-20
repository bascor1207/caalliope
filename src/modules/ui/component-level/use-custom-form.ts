import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { AppDispatch } from '@/modules/store/create-store';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';

export function useCustomForm<T extends FieldValues>(schema: ZodSchema<T>, action: UnknownAction | AppAsyncThunk, dispatch: (data: typeof action) => ReturnType<AppDispatch> ) {
    function onSubmit() {
        reset()
        // TODO dispatch action login
        dispatch(action);
    }

    const classNames=
        { inputWrapper: 'border-custom-purple hover:border-custom-dark-purple', label: 'text-custom-dark-purple' }

    const props = {
        isClearable: true,
        variant: 'underlined',
    } as const

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        resetField
    } = useForm<T>({
        resolver: zodResolver(schema),
    });

    return { control, handleSubmit, errors, onSubmit, resetField, props, classNames }

}
