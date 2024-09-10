'use client';

import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { UsersModel } from '@/modules/user/core/model/users.model';
import { selectContactFormState } from '@/modules/user/core/store/user.selectors';
import { contactUs } from '@/modules/user/core/store/user.slice';

export const ContactForm = ({ formType }: {formType: 'modal' | 'plain'}) => {
    const contactFormStatus = useAppSelector(selectContactFormState);
    const dispatch = useDispatch<AppDispatch>();

    const items = [
        { id:'reason', name: 'reason', label: 'Reason', type: 'text' }
    ] satisfies Array<{id: string, name: keyof UsersModel.ContactUsForm, label: string, type: string, options?: {value: string, label: string}[]}>;

    if (formType !== 'modal') {
        return (
            <section className='flex flex-col items-center justify-center w-full'>
                <h1>Contact us</h1>
                <div className='w-full max-w-md p-6'>
                    <CustomForm
                        formType='plain'
                        items={items}
                        schema={UsersModel.contactUsSchema}
                    />
                </div>
            </section>
        )
    }
    return contactFormStatus === 'displayed' && (
        <CustomForm
            formType='modal'
            modalTitle='Contactez-nous'
            visibilityTrigger={contactFormStatus === 'displayed'}
            onCustomClose={() => {
                dispatch(contactUs('hidden'))
            }}
            items={items}
            schema={UsersModel.contactUsSchema}
        />
    )
}
