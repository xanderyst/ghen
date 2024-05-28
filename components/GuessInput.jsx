import { Input } from '@material-tailwind/react';

const GuessInput = ({ guess, onChange, onKeyPress, isMobile }) => (
  <div className="flex w-72 flex-col items-center">
    <Input
      className="guess-input"
      type="text"
      size="md"
      value={guess}
      readOnly={isMobile}
      onChange={onChange}
      placeholder='Enter Pinyin'
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onKeyPress('Enter');
        }
      }}
    />
  </div>
);

export default GuessInput;
