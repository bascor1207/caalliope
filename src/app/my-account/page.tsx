'use client'
import { selectActiveProfileTab } from '@/modules/user/core/store/user.selectors';
import { useAppSelector } from '@/modules/store/create-store';

export default function MyAccountPage() {
    const activeProfileTab = useAppSelector(selectActiveProfileTab)
    return (
        <>
            {activeProfileTab === 'my-infos' && 'Mes Informations'}
            {activeProfileTab === 'my-books' && 'Mes Livres'}
        </>
    )
}
