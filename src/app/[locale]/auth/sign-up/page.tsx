import { ConnectionPage } from '@/modules/auth/ui/pages/connection.page';

export async function generateMetadata() {
    return {
        title: 'Inscription - Caalliope',
        description: 'Créez un compte sur Caalliope pour accéder à votre bibliothèque personnalisée, votre liste de souhaits, et bien plus encore.',
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    }
}
export default function SignUpPage() {
    return (
        <ConnectionPage type='signUp' />
    )
}
