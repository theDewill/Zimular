"use client"
import React, { createContext, useContext, useState } from 'react';

interface IndexContextType {
  selectedIndex: number | null;
  handleButtonClick: (index: number) => void;
}

const IndexContext = createContext<IndexContextType | undefined>(undefined);

export const useIndex = (): IndexContextType => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error('useIndex must be used within an IndexProvider');
  }
  return context;
};

export const IndexProvider: React.FC = ({ children }:any) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleButtonClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <IndexContext.Provider value={{ selectedIndex, handleButtonClick }}>
      {children}
    </IndexContext.Provider>
  );
};
