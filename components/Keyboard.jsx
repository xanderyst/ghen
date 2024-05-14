import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import ToneButton from './ToneButton';
const englishKeys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter']
];

const bopomofoKeys = [
  ['ㄅ', 'ㄉ', 'ˇ', 'ˋ', 'ㄓ', 'ˊ', '˙', 'ㄚ', 'ㄞ', 'ㄢ'],
  ['ㄆ', 'ㄊ', 'ㄍ', 'ㄐ', 'ㄔ', 'ㄗ', 'ㄧ', 'ㄛ', 'ㄟ', 'ㄣ'],
  ['ㄇ', 'ㄋ', 'ㄎ', 'ㄑ', 'ㄕ', 'ㄘ', 'ㄨ', 'ㄜ', 'ㄠ', 'ㄤ'],
  ['ㄈ', 'ㄌ', 'ㄏ', 'ㄒ', 'ㄖ', 'ㄙ', 'ㄩ', 'ㄝ', 'ㄡ', 'ㄥ'],
  ['Switch to Pinyin', 'ㄦ', 'Backspace', 'Enter']
];

const tones = ['¯', 'ˊ', 'ˇ', 'ˋ', '˙'];

const BackspaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
  </svg>
);

const Keyboard = ({ onKeyPress, disableEnter }) => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleKeyboard = () => {
    setIsEnglish(!isEnglish);
    onKeyPress('Clear');
  };

  const handleKeyClick = (key) => {
    if (key === 'Switch to Pinyin') {
      toggleKeyboard();
    } else {
      onKeyPress(key);
    }
  };

  const handleToneClick = (key) => {
    onKeyPress(key);
    document.getElementsByClassName('guess-input')[0].focus();
  }

  const isKeyTone = (key) => {
    return tones.includes(key);
  }

  function renderSVG({key, width, height, fill}) {
    if (key === '¯') {
        return (<svg fill={fill} width={width} height={height} viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="5" x2="100" y2="5" stroke={fill} strokeWidth="10"/>
          </svg>);
    }
    if (key === 'ˊ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 64 640 640" xmlns="http://www.w3.org/2000/svg">
            <path d="M594.53 145.37L6.18 600.1c-6.97 5.42-8.23 15.47-2.81 22.45L23.01 646.82C28.43 653 38.49 654.26 45.47 648.83L633.82 194.1c6.97-5.42 8.23-15.47 2.81-22.45l-19.64-25.27c-5.42-6.98-15.48-8.23-22.46-2.81z"/>
        </svg>;
    }
    if (key === 'ˇ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10l7 7 7-7" stroke={fill} strokeWidth="2" fill="none" />
        </svg>;
    }
    if (key === 'ˋ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg">
            <path d="M594.53 508.63L6.18 53.9c-6.97-5.42-8.23-15.47-2.81-22.45L23.01 6.18C28.43-.8 38.49-2.06 45.47 3.37L633.82 458.1c6.97 5.42 8.23 15.47 2.81 22.45l-19.64 25.27c-5.42 6.98-15.48 8.23-22.46 2.81z"/>
        </svg>;
    }
    if (key === '˙') {
        return <svg fill={fill} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" fill={fill} />
        </svg>;
    }
    if (key === 'Backspace') {
        return <BackspaceIcon /> 
    }
    return key;
}

  const keys = isEnglish ? englishKeys : bopomofoKeys;

  return (
    <div>
      {isEnglish && <div className="mb-2 flex justify-center gap-4">
      {tones.map(tone => (
              <ToneButton key={tone} addTone={handleToneClick} tone={tone} width="15px" height="15px" fill="#FFFFFF" size="sm"></ToneButton>
          ))}
      </div>
      }
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1">
          {row.map((key, keyIndex) => (
            <div key={keyIndex} className="m-0.5">
              {
              key ? (
                <Button
                  ripple="light"
                  disabled={key==='Enter' && disableEnter}
                  className={`p-3 h-12 text-white rounded focus:outline-none ${
                    (key === 'Switch to Pinyin' || isKeyTone(key)) ? 'bg-gray-500' : key === 'Backspace' ? 'bg-red-500' : key === 'Enter' ? 'bg-green-500' : ''
                  }`}
                  onClick={() => handleKeyClick(key)}
                >
                  {renderSVG({key, width: '12px', height: '14px', fill: '#FFFFFF'})}
                </Button>
              ) : (
                <div className="p-3 w-9 h-12"></div> // Placeholder for spacing
              )}
            </div>
          ))}
        </div>
      ))}
      {isEnglish && <Button
        onClick={toggleKeyboard}
        className="mt-1 mb-2 p-3 text-white bg-gray-500 rounded focus:outline-none"
      >
        Switch to ㄅㄆㄇㄈ
      </Button>}
    </div>
  );
};

export default Keyboard;
