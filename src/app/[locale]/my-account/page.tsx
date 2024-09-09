import MyAccountPage from '@/modules/user/ui/pages/my-account.page';

export async function generateMetadata() {
    return {
        title: 'Mon compte',
        description: 'Mon compte Caalliope',
        icons: '/favico.png',
        metadataBase: new URL('https://caalliope.vercel.app')
    };
}

export default function AccountPage() {
    return (
        <MyAccountPage />
    )
}
