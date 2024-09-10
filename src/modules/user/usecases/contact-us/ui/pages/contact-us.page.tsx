import { ContactForm } from '@/modules/user/usecases/contact-us/ui/forms/contact-form';

export const ContactUsPage = ({ formType }: {formType: 'modal' | 'plain'}) => {
    return (
        <ContactForm formType={formType} />
    )
}
