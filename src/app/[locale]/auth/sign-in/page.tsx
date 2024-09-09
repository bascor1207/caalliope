import { ConnectionPage } from '@/modules/auth/ui/pages/connection.page';

export async function generateMetadata() {
    return {
        title: 'Connexion - Caalliope',
        description: 'Connectez-vous à votre compte Caalliope pour accéder à vos livres, lectures et plus encore.',
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app'),
    }
}

export default function SignInPage() {
    return (
        <ConnectionPage type='signIn' />
    )
}
