import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

import type { ChangeEvent } from 'react';

type SearchBarProps = {
    setQuery: (query: string, type: 'name' | 'author') => void;
    query: string;
};

const determineSearchType = (value: string): 'name' | 'author' => {
    return value.includes(' ') ? 'author' : 'name';
};

export const SearchBar = ({ setQuery, query }: SearchBarProps) => {
    const { t } = useTranslation();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const type = determineSearchType(value);
        setQuery(value, type);
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='text-2xl mb-6'>
                <p>{t('library.search')}</p>
            </div>
            <TextField
                id='search-bar'
                className='w-80'
                label='Name, Author... '
                variant='outlined'
                value={query}
                placeholder='Search...'
                size='small'
                onChange={handleInputChange}
            />
        </div>
    );
};
