import { Typography } from '@material-tailwind/react';

const highlightGuessedCharacter = (text, character) => {
  if (text && text.includes(character)) {
    return text.split('').map((char, index) => (
      char === character ? <span key={index} style={{ color: 'red' }}>{char}</span> : char
    ));
  }
  return text;
};

const CharacterDisplay = ({ character, attempt }) => (
  <div className="text-center">
    <Typography variant="h2">{character.character}</Typography>
    {attempt !== 5 && <Typography variant="h5">Attempt: {attempt}</Typography>}
    <br />
    {attempt !== 5 && <Typography variant="h4">Hint</Typography>}
    {attempt === 1 && <Typography variant="h4">{highlightGuessedCharacter(character.phrase, character.character)}</Typography>}
    {attempt === 2 && <Typography variant="h4">{highlightGuessedCharacter(character.sentence, character.character)}</Typography>}
    {attempt === 3 && <Typography variant="h4">Translation: {character.translation}</Typography>}
    {attempt === 4 && <Typography variant="h4">Answer: {character.pinyin} or {character.bopomofo}</Typography>}
  </div>
);

export default CharacterDisplay;
