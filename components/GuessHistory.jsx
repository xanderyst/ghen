import { Typography } from '@material-tailwind/react';

const GuessHistory = ({ guessHistory }) => (
  <div style={{ padding: '5px' }} className="text-center">
    <Typography variant="h4">Characters Guessed</Typography>
    {guessHistory.map((element, index) => (
      <div
        key={index}
        className={`inline-block m-1 p-2 w-12 h-12 rounded ${element.attempt <= 5
          ? ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-gray-400'][element.attempt - 1]
          : 'bg-gray-400'}`}
      >
        {element.character}
      </div>
    ))}
  </div>
);

export default GuessHistory;
