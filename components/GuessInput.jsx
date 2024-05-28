import { Input, Typography } from '@material-tailwind/react';

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
    <Typography
          variant="small"
          color="gray"
          className="mt-2 flex items-center gap-1 font-normal"
      >
          <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-mt-px h-4 w-4"
          >
          <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
          />
          </svg>
          Remember ¯ is also a tone in pinyin
      </Typography>
  </div>
);

export default GuessInput;
