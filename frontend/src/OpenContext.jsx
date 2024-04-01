import React, { createContext, useState } from 'react';

export const OpenContext = createContext();

export function OpenProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <OpenContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </OpenContext.Provider>
  );
}
