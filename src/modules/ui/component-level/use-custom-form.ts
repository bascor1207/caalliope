import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z, ZodObject } from 'zod';
import { AppDispatch } from '@/modules/store/create-store';
import { UnknownAction } from '@reduxjs/toolkit';
import { AppAsyncThunk } from '@/modules/store/create-app-thunk';

type UseCustomFormProps<T extends FieldValues, A = void> = {
    schema: ZodObject<T>
    action?: UnknownAction | AppAsyncThunk<A>;
    dispatch: (data: UnknownAction | AppAsyncThunk<A>) => ReturnType<AppDispatch>
}

export function useCustomForm<T extends FieldValues, A>({ schema, action, dispatch }: UseCustomFormProps<T, A> ) {
    function onSubmit() {
        reset()
        if (action) {
            dispatch(action);
        }
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
        resetField
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    return { control, handleSubmit, errors, onSubmit, resetField, props, classNames }

}
