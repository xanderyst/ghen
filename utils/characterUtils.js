import { firstGrade, secondGrade, thirdGrade, fourthGrade, fifthGrade, sixthGrade } from '@utils/characters';

export const loadCharactersAndBuildMap = (grade) => {
  let characters;
  switch (grade) {
    case 1:
      characters = firstGrade;
      break;
    case 2:
      characters = secondGrade;
      break;
    case 3:
      characters = thirdGrade;
      break;
    case 4:
      characters = fourthGrade;
      break;
    case 5:
      characters = fifthGrade;
      break;
    case 6:
      characters = sixthGrade;
      break;
    default:
      characters = firstGrade;
      break;
  }
  const characterMap = {};
  characters.forEach(char => {
    characterMap[`${char.unicode}`] = char;
  });
  return { characters, characterMap };
};

export const buildCharactersToDisplay = (progressInput, characters, characterMap, dailyLimit) => {
  const array = [];
  const { charactersToReview, characterStartIndex } = progressInput;
  charactersToReview.forEach(char => array.push(char));
  if (array.length < dailyLimit) {
    for (let i = characterStartIndex; array.length < dailyLimit; i++) {
      if (i >= characters.length) return array;
      const { character, unicode } = characters[i];
      array.push({ character, unicode });
    }
  }
  return array;
};
