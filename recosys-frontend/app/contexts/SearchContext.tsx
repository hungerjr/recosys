'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the search options
export type SearchOption = {
  value: string;
  label: string;
};

// Define the shape of the context data
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchBy: SearchOption;
  setSearchBy: (option: SearchOption) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// The SearchProvider component will wrap our dashboard
export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  // Set a default search option
  const [searchBy, setSearchBy] = useState<SearchOption>({ value: 'name', label: 'Name' });

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchBy, setSearchBy }}>
      {children}
    </SearchContext.Provider>
  );
}

// A custom hook to easily access the search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}