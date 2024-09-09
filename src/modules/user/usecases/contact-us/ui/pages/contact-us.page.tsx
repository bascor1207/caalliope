import { ContactForm } from '@/modules/app/ui/app-level/contact-form';

export const ContactUsPage = ({ formType }: {formType: 'modal' | 'plain'}) => {
    return (
        <ContactForm formType={formType} />
    )
}
