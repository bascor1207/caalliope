import { Input } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const determineSearchType = (value: string): 'name' | 'author' => {
    return value.includes(' ') ? 'author' : 'name';
};

export const SearchBar = () => {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleTabChange = (value: string) => {
        const searchType = determineSearchType(value);

        const params = new URLSearchParams(searchParams.toString());
        params.set('search', value);
        params.set('type', searchType);

        router.push(`?${params.toString()}`);
    };

    const classNames = { inputWrapper: 'border-custom-dark-purple' };

    return (
        <div className='flex flex-col items-center'>
            <div className='text-2xl mb-6'>
                <p>{t('library.search')}</p>
            </div>
            <Input
                classNames={classNames}
                id='search-bar'
                className='w-80'
                label={t('searchBar.nameAuthor')}
                variant='bordered'
                placeholder={t('searchBar.search')}
                size='sm'
                onChange={(e) => handleTabChange(e.target.value)}
                isClearable
                onClear={() => handleTabChange('')}
            />
        </div>
    );
};
