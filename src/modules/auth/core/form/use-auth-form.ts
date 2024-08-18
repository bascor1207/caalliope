
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { useForm } from 'react-hook-form';

export const useAuthForm = () => {
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
    } = useForm<AuthModel.AuthFormSchema>({
        resolver: zodResolver(AuthModel.signInFormSchema),
    });

    return { control, handleSubmit, errors, onSubmit, resetField, props, classNames }

}
