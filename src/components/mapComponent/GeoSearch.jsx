import React, { useState, useEffect } from 'react';
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { FaSearch, FaTimes } from 'react-icons/fa';
import { setSelectedGeosearch } from '../../../src/hooks/useSelectedGeosearch';
import useDebounce from '../../hooks/useDebounce';

export default function GeoSearch() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchManuallyUpdated, setIsSearchManuallyUpdated] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    useEffect(() => {
        if (debouncedSearchTerm && isSearchManuallyUpdated) {
            handleSearch(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, isSearchManuallyUpdated]);

    const handleSearch = (query) => {
        const provider = new OpenStreetMapProvider();
        provider.search({ query })
            .then(results => {
                setSearchResults(results);
            });
    };

    const handleResultClick = (result) => {
        setSelectedGeosearch(result);
        setSearchTerm(result?.label);
        setIsSearchManuallyUpdated(false); // Setting this to false to prevent the API call
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSelectedGeosearch(null); // Clear the selected geosearch result
    };

    return (
        <div className="relative w-[140%]">
            <input
                type="text"
                placeholder="Search Location"
                className="w-full pl-10 pr-10 py-[10px] text-sm text-gray-200 bg-[#4786c7] placeholder:text-gray-200 rounded-full outline-none"
                value={searchTerm}
                onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsSearchManuallyUpdated(true); // Marking the search as manually updated
                }}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-4 h-4" />
            {searchTerm && (
                <FaTimes
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-3 h-3 cursor-pointer"
                    onClick={handleClearSearch}
                />
            )}
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded mt-2 cursor-pointer">
                    {searchResults.map(result => (
                        <div key={result.label} className="p-2 hover:bg-gray-100" onClick={() => handleResultClick(result)}>
                            {result.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
