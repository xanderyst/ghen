import React from 'react'
import { Button } from '@material-tailwind/react';

function renderSVG(tone, width, height, fill) {
    if (tone === '¯') {
        return (<svg fill={fill} width={width} height={height} viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="5" x2="100" y2="5" stroke={fill} strokeWidth="10"/>
          </svg>);
    }
    if (tone === 'ˊ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 64 640 640" xmlns="http://www.w3.org/2000/svg">
            <path d="M594.53 145.37L6.18 600.1c-6.97 5.42-8.23 15.47-2.81 22.45L23.01 646.82C28.43 653 38.49 654.26 45.47 648.83L633.82 194.1c6.97-5.42 8.23-15.47 2.81-22.45l-19.64-25.27c-5.42-6.98-15.48-8.23-22.46-2.81z"/>
        </svg>;
    }
    if (tone === 'ˇ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10l7 7 7-7" stroke={fill} strokeWidth="2" fill="none" />
        </svg>;
    }
    if (tone === 'ˋ') {
        return <svg fill={fill} width={width} height={height} viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg">
            <path d="M594.53 508.63L6.18 53.9c-6.97-5.42-8.23-15.47-2.81-22.45L23.01 6.18C28.43-.8 38.49-2.06 45.47 3.37L633.82 458.1c6.97 5.42 8.23 15.47 2.81 22.45l-19.64 25.27c-5.42 6.98-15.48 8.23-22.46 2.81z"/>
        </svg>;
    }
    if (tone === '˙') {
        return <svg fill={fill} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" fill={fill} />
        </svg>;
    }
    return null;
}

function ToneButton({ addTone, tone, width, height, fill}) {
    return (
        <Button onClick={() => addTone(tone)} size="lg" ripple="light">
          {renderSVG(tone, width, height, fill)}
        </Button>
      );
}

export default ToneButton