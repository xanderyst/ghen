// import Feed from '@components/Feed';

// const Home = () => {
//   return (
//     <section className="w-full flex-center flex-col">
//         <h1 className="head_text text-center">
//             Discover & Share
//             <br className="max-md:hidden" />
//             <span className="orange_gradient text-center"> AI-Powered Prompts</span>
//         </h1>
//         <p className="desc text-center">
//             Promptopia is an open-source AI prompting tool for modern world to discover, create and share creative prompts
//         </p>

//         <Feed />
//     </section>
//   )
// }

// export default Home
"use client";
import ToneButton from '@components/ToneButton';
import { cloneDeep } from 'lodash';
import { firstGrade, secondGrade, thirdGrade, fourthGrade, fifthGrade, sixthGrade } from '@utils/characters';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { 
  Card,
  CardBody,
  CardFooter,
  Typography,
  ButtonGroup, 
  Button, 
  Input } from '@material-tailwind/react';

const tones = ['¯', 'ˊ', 'ˇ', 'ˋ', '˙'];

let characterMap = {};
let characters = firstGrade;
// characters.forEach(char => {
//     characterMap[`${char.unicode}`] = char;
// });
const loadCharactersAndBuildMap = (grade) => {
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
    characterMap = {};
    characters.forEach(char => {
        characterMap[`${char.unicode}`] = char;
    });
};
loadCharactersAndBuildMap(1);
console.log('characters', characters);
console.log('characterMap', characterMap);

const App = () => {
    const [charactersToDisplay, setCharactersToDisplay] = useState([]);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [characterToDisplay, setCharacterToDisplay] = useState('');
    const [progress, setProgress] = useState({characterStartIndex: 0, charactersLearned: [], charactersToReview: [], grade: 1});
    const [guess, setGuess] = useState('');
    const [attempt, setAttempt] = useState(1);
    const [guessHistory, setGuessHistory] = useState([]);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showContinue, setShowContinue] = useState(false);
    // const [characters, setCharacters] = useState(firstGrade);
    // const [characterMap, setCharacterMap] = useState({})

    const { data: session, status } = useSession();
    console.log('session', session);
    console.log('status', status);
    const user = session?.user;
    const dailyLimit = 10;

    // const loadCharactersAndBuildMap = (grade) => {
    //     let tempCharacters;
    //     switch (grade) {
    //         case 1:
    //             tempCharacters = firstGrade;
    //             break;
    //         case 2:
    //             tempCharacters = secondGrade;
    //             break;
    //         case 3:
    //             tempCharacters = thirdGrade;
    //             break;
    //         case 4:
    //             tempCharacters = fourthGrade;
    //             break;
    //         case 5:
    //             tempCharacters = fifthGrade;
    //             break;
    //         case 6:
    //             tempCharacters = sixthGrade;
    //             break;
    //         default: 
    //             tempCharacters = firstGrade;
    //             break;
    //     }
    //     let tempCharacterMap = {};
    //     tempCharacters.forEach(char => {
    //         tempCharacterMap[`${char.unicode}`] = char;
    //     });
    //     setCharacters(characters);
    //     setCharacterMap(tempCharacterMap);
    // };

    const buildCharactersToDisplay = (progressInput) => {
        const array = [];
        const { charactersToReview, characterStartIndex } = progressInput;
        charactersToReview.forEach(char => {
            array.push(char);
        });
        if (array.length<dailyLimit) {
            for(let i=characterStartIndex; array.length<dailyLimit; i++) {
                if (i >= characters.length) return array;
                const { character, unicode } = characters[i];
                array.push({ character, unicode });
            }
        }
        return array;
    }

    useEffect(() => {
        console.log('beginning useeffect user', user);
        if (!user) {
            // const defaultProgess = {
            //     charactersLearned: [],
            //     charactersToReview: ['5F88'],
            //     characterStartIndex: 1
            // }
            const defaultDisplayArray = buildCharactersToDisplay(progress)
            console.log('defaultDisplayArray', defaultDisplayArray);
            setCharactersToDisplay(defaultDisplayArray);
            const fullChar = characterMap[defaultDisplayArray[0].unicode];
            console.log('fullChar', fullChar);
            setCharacterToDisplay(fullChar);
            // setProgress(defaultProgess);
            // setCurrentCharacterIndex(0);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${user.id}`);
                const data = await response.json();
                const tempToday = data.today;
                const tempProgress = data.progress;
                loadCharactersAndBuildMap(tempProgress.grade);
                console.log('fetchuser characters', characters);
                console.log('fetchuser characterMap', characterMap);
                setProgress(tempProgress);

                let displayArray;
                if (tempToday?.charactersArray?.length) {
                    displayArray = tempToday.charactersArray;
                } else {
                    displayArray = buildCharactersToDisplay(tempProgress);
                }
                console.log('displayArray', displayArray);
                setCharactersToDisplay(displayArray);

                const characterIndex = tempToday.characterIndex || 0;
                setCurrentCharacterIndex(characterIndex);
                if (characterIndex < dailyLimit && characterIndex < displayArray.length) {
                    const fullChar = characterMap[displayArray[characterIndex].unicode];
                    console.log('fullChar', fullChar);
                    setCharacterToDisplay(fullChar);
                }

                if (tempToday?.guessHistory?.length) {
                    const guessHistoryArray = tempToday.guessHistory;
                    setGuessHistory(tempToday.guessHistory);
                }

                if (tempToday.characterIndex === dailyLimit) {
                    const allTenCorrect = tempToday.guessHistory.every(guess => guess.attempt === 1);
                    console.log('allTenCorrect', allTenCorrect);
                    if (allTenCorrect) {
                        setShowContinue(true);
                    }
                }
                console.log('showContinue', showContinue);
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    }, [user?.id]);
    

    //form functions
    const addTone = (tone) => {
      setGuess(prevGuess => prevGuess + tone);
    };

    const handleGuessInputChange =  (event) => {
      setGuess(event.target.value);
    };
    
    const highlightGuessedCharacter = (text) => {
        console.log('text', text);
        const character = characterToDisplay.character;
        console.log('characterToDisplay', characterToDisplay);
        if (text.includes(character)) {
            return text.split('').map((char, index) => (
                char === character ? <span key={index} style={{ color: 'red' }}>{char}</span> : char
            ));
        }
        return text;
    };

    //update api
    const updateProgress = async (input) => {
        console.log('updateProgress input', input);
        try {
            const response = await fetch(`/api/users/${user.id}/progress`, {
              method: "PATCH",
              body: JSON.stringify({
                ...input
              }),
            });
            return response;
          } catch (error) {
            console.log(error);
          }
    };

    const updateToday = async (input) => {
        console.log('updateToday input', input);
        try {
            const response = await fetch(`/api/users/${user.id}/today`, {
              method: "PATCH",
              body: JSON.stringify({
                ...input
              }),
            });
            return response;
          } catch (error) {
            console.log(error);
          }
    }

    const isSameCharacter = (char, charDisplay) => {
        if (!char || !charDisplay) return false;
        return char.character === charDisplay.character;
    }

    const handleNext = async () => {
        const displayArray = buildCharactersToDisplay(progress);
        console.log('handleNext displayArray', displayArray);
        const newToday = {
            guessHistory: [],
            charactersArray: displayArray,
            characterIndex: 0
        }

        const todayResponse = await updateToday(newToday);
        const tempNewToday = await todayResponse.json();

        const newCharacterToDisplay = tempNewToday.charactersArray[tempNewToday.characterIndex];
        const newFullChar = characterMap[newCharacterToDisplay.unicode];
        setCharacterToDisplay(newFullChar);
        setCharactersToDisplay(tempNewToday.charactersArray);
        setCurrentCharacterIndex(tempNewToday.characterIndex);
        setGuessHistory(tempNewToday.guessHistory);
        if (showLevelUp) {
            setShowLevelUp(false);
        } else if (showContinue) {
            setShowContinue(false);
        }
        
    }

    const handleSubmit = async () => {
        const newProgress = cloneDeep(progress);
        const lastCharIndex = newProgress.charactersToReview.length - 1;
        const charToPeek = newProgress.charactersToReview[lastCharIndex];
        const isCharFromReview = isSameCharacter(charToPeek, characterToDisplay);
        const { unicode, character } = characterToDisplay;
        const processedCharacter = { unicode, character };
        if (guess === characterToDisplay.pinyin) {
            if (isCharFromReview) {
                newProgress.charactersToReview.pop();
            } else {
                newProgress.characterStartIndex++;
            }
            if (attempt === 1) {
                newProgress.charactersLearned.push(processedCharacter);
            } else {
                newProgress.charactersToReview.unshift(processedCharacter);
            }
        } else if (attempt <5) {
            setGuess('');
            setAttempt(attempt + 1);
            return;
        } else {
            if (isCharFromReview) {
                newProgress.charactersToReview.pop();
                newProgress.charactersToReview.unshift(processedCharacter);
            } else {
                newProgress.characterStartIndex++;
            }
        }

        const tempGuessHistory = [...guessHistory, {...processedCharacter, attempt }];
        const newToday = {
            guessHistory: tempGuessHistory,
            charactersArray: charactersToDisplay,
            characterIndex: currentCharacterIndex+1
        }

        const hasCharactersToReview = !!newProgress.charactersToReview.length;

        if (newProgress.characterStartIndex >= characters.length && !hasCharactersToReview) {
            newProgress.grade++;
            newProgress.characterStartIndex = 0;
            console.log('newProgress', newProgress);
            loadCharactersAndBuildMap(newProgress.grade);
            console.log('characters', characters);
            console.log('characterMap', characterMap);
            setShowLevelUp(true);
            // update characters to read from
            // update charactermap
            // rebuild characters to learn
            // update user
        }

        if (newProgress.characterStartIndex === dailyLimit) {
            const allTenCorrect = newToday.guessHistory.every(guess => guess.attempt === 1);
            console.log('allTenCorrect', allTenCorrect);
            if (allTenCorrect) {
                setShowContinue(true);
            }
        }

        let tempNewToday;
        let tempNewProgress;
        if (user) {
            const progressResponse = await updateProgress(newProgress);
            tempNewProgress = await progressResponse.json();

            const todayResponse = await updateToday(newToday);
            tempNewToday = await todayResponse.json();
        } else {
            tempNewProgress = newProgress;
            tempNewToday = newToday;
        }
        console.log('tempNewProgress', tempNewProgress);
        console.log('tempNewToday', tempNewToday);

        setProgress(tempNewProgress);
        setGuessHistory(tempNewToday.guessHistory);
        setCurrentCharacterIndex(tempNewToday.characterIndex);
        if (tempNewToday.characterIndex<charactersToDisplay.length && tempNewToday.characterIndex<dailyLimit) {
            const newCharacterToDisplay = tempNewToday.charactersArray[tempNewToday.characterIndex];
            const newFullChar = characterMap[newCharacterToDisplay.unicode];
            setCharacterToDisplay(newFullChar);
        }
        setGuess('');
        setAttempt(1);
    };

    const getCharacterPanelColor = () => {
        const attemptHistory = guessHistory[guessHistory.length - 1];
        switch (attemptHistory) {
            case 1:
                return 'green';
            case 2:
                return 'yellow';
            case 3:
                return 'orange';
            case 4:
                return 'red';
            case 5:
                return 'gray';
            default:
                return 'gray';
        }
    };

    return (
        <div>
            {!!guessHistory.length && <div style={{ padding: '5px' }} className="text-center">
                <Typography variant="h4">Characters Guessed</Typography>
                {guessHistory.map((element, index) => (
                        <div key={index} className={`inline-block m-1 p-2 w-12 h-12 rounded ${element.attempt <= 5 ? ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-gray-400'][element.attempt - 1] : 'bg-gray-400'}`}>{element.character}</div>
                ))} 
            </div>}
            {(status === 'loading') ? (<div className="text-center">
              <Typography variant="h1">Loading...</Typography>
            </div>) :
            showLevelUp ? (<div className="text-center">
              <Typography variant="h1">Congrats! You have graduated from grade {progress.grade-1}</Typography>
              <br />
              <Button
                    size="md"
                    onClick={handleNext}
                  >
                    Yay!
                  </Button>
            </div>) :
            currentCharacterIndex >= charactersToDisplay.length && charactersToDisplay.length < dailyLimit ?
            (<div>
                <br />
                <Typography variant="h1">End of Grade {progress.grade}</Typography>
              </div>) :
            showContinue ?
            (<div>
                <br />
                <div className="text-center">
                <Typography variant="h1">You got 10 correct!</Typography>
                <Typography variant="h3">You get to play more until you make a mistake</Typography>
                <br />
                <Button
                    size="md"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                </div>
              </div>) :
            currentCharacterIndex >= dailyLimit  ? 
            (<div>
              <br />
              <Typography variant="h1">You have reached the daily limit.</Typography>
            </div>) :
            (<><div className="text-center">
                <br />
                <Typography variant="h2">{characterToDisplay.character}</Typography>
                {attempt !==5 && <Typography variant="h4">Attempt: {attempt}</Typography>}
                <br />
                {attempt !==5 && <Typography variant="h4">Hint</Typography>}
                {attempt === 1 && <Typography variant="h4">{highlightGuessedCharacter(characterToDisplay.phrase)}</Typography>}
                {attempt === 2 && <Typography variant="h4">{highlightGuessedCharacter(characterToDisplay.sentence)}</Typography>}
                {attempt === 3 && <Typography variant="h4">Translation: {characterToDisplay.translation}</Typography>}
                {attempt === 4 && <Typography variant="h4">Type the answer below: {characterToDisplay.pinyin}</Typography>}
            </div>
            <div className="text-center">
                <br />
                  <Input
                    type="text"
                    size="md"
                    value={guess}
                    onChange={handleGuessInputChange}
                    placeholder='Enter Pinyin'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                        handleSubmit();
                        }
                    }}
                  />
                  <br />
                  <Button
                    size="md"
                    color={guess ? "gray" : "blue-gray"}
                    disabled={!guess}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                <br />
                <br />
                <Typography variant="h4">You can enter tones using the following buttons</Typography>
                <br />
                <div className="flex w-max gap-4">
                {tones.map(tone => (
                        <ToneButton key={tone} addTone={addTone} tone={tone} width="15px" height="15px" fill="#FFFFFF"></ToneButton>
                    ))}
                </div>
            </div>
            </>)
            }
        </div>
    );
};

export default App;