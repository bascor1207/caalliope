import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';

export function useCustomForm<T extends FieldValues>(schema: ZodSchema<T>) {
    function onSubmit() {
        reset()
        // TODO dispatch action login
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
