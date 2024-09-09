import { ContactUsPage } from '@/modules/user/usecases/contact-us/ui/pages/contact-us.page';

export async function generateMetadata() {
    return {
        title: 'Contactez-nous - Caalliope',
        description: 'Contactez-nous pour toute question ou tout problème.',
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    }
}

export default function ContactPage() {
    return (
        <ContactUsPage formType='plain'/>
    )
}
