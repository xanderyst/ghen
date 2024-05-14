import React from 'react';
import { Button } from '@material-tailwind/react';
const keys = [
  ['¯', 'ˊ', 'ˇ', 'ˋ', '˙'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ['Clear', 'Backspace', 'Enter']
];

const Keyboard = ({ onKeyPress }) => {
  const handleKeyClick = (key) => {
    onKeyPress(key);
  };

  return (
    <div className="sm:hidden">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key) => (
            <Button
              key={key}
              ripple="light"
              className="m-1 p-3 text-white rounded focus:outline-none"
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
