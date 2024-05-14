import React from 'react';
import { Button } from '@material-tailwind/react';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter']
];
const tones = ['¯', 'ˊ', 'ˇ', 'ˋ', '˙'];

const BackspaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
  </svg>
  
);

const Keyboard = ({ onKeyPress }) => {
  const handleKeyClick = (key) => {
    onKeyPress(key);
  };

  return (
    <div className="sm:hidden">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1">
          {row.map((key) => (
            <Button
              key={key}
              ripple="light"
              className={`m-0.5 p-3 h-12 text-white rounded focus:outline-none ${
                key === 'Backspace' ? 'bg-red-500' : key === 'Enter' ? 'bg-green-500' : ''
              }`}
              onClick={() => handleKeyClick(key)}
            >
              {key === 'Backspace' ? <BackspaceIcon /> : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
