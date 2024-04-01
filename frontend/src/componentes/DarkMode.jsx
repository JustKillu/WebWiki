import React from 'react';
import { ThemeContext } from '../ThemeProvider';

const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = React.useContext(ThemeContext);

  return (
    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
      <input 
        type="checkbox" 
        name="toggle" 
        id="toggle" 
        checked={darkMode} 
        onChange={() => setDarkMode(!darkMode)} 
        className={`toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transform ${darkMode ? 'translate-x-3' : ''} transition-transform duration-200 ${darkMode ? 'bg-brown border-brown' : 'bg-yellow-200 border-yellow-200'}`}
      />
      <label 
        htmlFor="toggle" 
        className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer`}
      ></label>
    </div>
  );
};

export default DarkModeSwitch;
