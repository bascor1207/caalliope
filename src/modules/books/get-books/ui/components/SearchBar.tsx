'use client'
import { FC, useState } from "react";

import styles from './search-bar.module.scss';

type SearchBarProps = {
    onSearch: (query: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };
    
    const handleSearch = () => {
        onSearch(query);
    };
    
    return (
        <div className={styles.container}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    )
}
