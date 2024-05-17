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
import Keyboard from '@components/Keyboard';
import { cloneDeep, toLower } from 'lodash';
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
  Input,
Spinner } from '@material-tailwind/react';

const tones = ['¯', 'ˊ', 'ˇ', 'ˋ', '˙'];

let characterMap = {};
let characters = firstGrade;
let loading;
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
    const [isMobile, setIsMobile] = useState(false);

    const { data: session, status } = useSession();
    const user = session?.user;
    const dailyLimit = 10;

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
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        console.log('session', session);
        console.log('status', status);
        if (!user) {
            // const defaultProgess = {
            //     charactersLearned: [],
            //     charactersToReview: ['5F88'],
            //     characterStartIndex: 1
            // }
            const defaultDisplayArray = buildCharactersToDisplay(progress)
            setCharactersToDisplay(defaultDisplayArray);
            const fullChar = characterMap[defaultDisplayArray[0].unicode];
            setCharacterToDisplay(fullChar);
            // setProgress(defaultProgess);
            // setCurrentCharacterIndex(0);
            return;
        }

        if(typeof window !== 'undefined') {
            window.clearToday = async (userId=user.id) => {
                const emptyToday = {
                    guessHistory: [],
                    charactersArray: [],
                    characterIndex: 0
                }
                try {
                    const response = await fetch(`/api/users/${userId}/today`, {
                        method: "PATCH",
                        body: JSON.stringify({
                        ...emptyToday
                        }),
                    });
                    return response;
                } catch (error) {
                    console.log(error);
                }
            }
        }

        const fetchUser = async () => {
            try {
                loading = true;
                const response = await fetch(`/api/users/${user.id}`);
                const data = await response.json();
                const tempToday = data.today;
                const tempProgress = data.progress;
                loadCharactersAndBuildMap(tempProgress.grade);
                setProgress(tempProgress);

                let displayArray;
                if (tempToday?.charactersArray?.length) {
                    displayArray = tempToday.charactersArray;
                } else {
                    displayArray = buildCharactersToDisplay(tempProgress);
                }
                setCharactersToDisplay(displayArray);

                const characterIndex = tempToday.characterIndex || 0;
                setCurrentCharacterIndex(characterIndex);
                if (characterIndex < dailyLimit && characterIndex < displayArray.length) {
                    const fullChar = characterMap[displayArray[characterIndex].unicode];
                    setCharacterToDisplay(fullChar);
                }

                if (tempToday?.guessHistory?.length) {
                    const guessHistoryArray = tempToday.guessHistory;
                    setGuessHistory(tempToday.guessHistory);
                }

                if (tempToday.characterIndex === dailyLimit) {
                    const allTenCorrect = tempToday.guessHistory.every(guess => guess.attempt === 1);
                    if (allTenCorrect) {
                        setShowContinue(true);
                    }
                }
                loading = false;
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    }, [user?.id]);
    

    //form functions
    const handleGuessInputChange =  (event) => {
      setGuess(event.target.value);
    };

    const handleKeyPress = (key) => {
        if (key === 'Backspace') {
            setGuess(guess.slice(0, -1));
        } else if (key === 'Enter') {
            handleSubmit();
        } else if (key === 'Clear') {
            setGuess('');
        } else {
            setGuess(guess + key);
        }
    };
    
    const highlightGuessedCharacter = (text) => {
        const character = characterToDisplay.character;
        if (text && text.includes(character)) {
            return text.split('').map((char, index) => (
                char === character ? <span key={index} style={{ color: 'red' }}>{char}</span> : char
            ));
        }
        return text;
    };

    //update api
    const updateProgress = async (input) => {
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

    const disableEnter = () => {
        const correctGuess = toLower(guess) === characterToDisplay.pinyin || (guess === characterToDisplay.bopomofo);
        return attempt >=4 && !correctGuess;
    }

    const handleNext = async () => {
        const displayArray = buildCharactersToDisplay(progress);
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

    const findIndexOfChar = (reviewArray, charToFind) => {
        const { unicode, character } = charToFind;
        const charInReview = reviewArray.find(char => char.character === charToFind.character);
        return reviewArray.indexOf(charInReview);
    }

    const handleSubmit = async () => {
        const newProgress = cloneDeep(progress);
        const indexOfCharDisplay = findIndexOfChar(newProgress.charactersToReview, characterToDisplay);
        const reviewHasChar = indexOfCharDisplay > -1;

        const { unicode, character } = characterToDisplay;
        const processedCharacter = { unicode, character };
        if (toLower(guess) === characterToDisplay.pinyin || (guess === characterToDisplay.bopomofo)) {
            if (reviewHasChar) {
                newProgress.charactersToReview.splice(indexOfCharDisplay, 1);
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
            if (reviewHasChar) {
                newProgress.charactersToReview.splice(indexOfCharDisplay, 1);
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
            loadCharactersAndBuildMap(newProgress.grade);
            setShowLevelUp(true);
            // update characters to read from
            // update charactermap
            // rebuild characters to learn
            // update user
        }

        if (newToday.characterIndex === dailyLimit) {
            const allTenCorrect = newToday.guessHistory.every(guess => guess.attempt === 1);
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
            {(status === 'loading' || loading) ? (<div className="flex flex-row text-center">
              <Spinner className="h-12 w-12 mr-4 mt-2" />
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
            session && currentCharacterIndex >= charactersToDisplay.length && charactersToDisplay.length < dailyLimit ?
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
                {attempt !==5 && <Typography variant="h5">Attempt: {attempt}</Typography>}
                <br />
                {attempt !==5 && <Typography variant="h4">Hint</Typography>}
                {attempt === 1 && <Typography variant="h4">{highlightGuessedCharacter(characterToDisplay.phrase)}</Typography>}
                {attempt === 2 && <Typography variant="h4">{highlightGuessedCharacter(characterToDisplay.sentence)}</Typography>}
                {attempt === 3 && <Typography variant="h4">Translation: {characterToDisplay.translation}</Typography>}
                {attempt === 4 && <Typography variant="h4">Answer {characterToDisplay.pinyin} or {characterToDisplay.bopomofo}</Typography>}
            </div>
            <div className="text-center flex flex-col items-center m-auto">
                <br />
                  <div className="flex w-72 flex-col items-center">
                    <Input
                        className="guess-input"
                        type="text"
                        size="md"
                        value={guess}
                        readOnly={isMobile}
                        onChange={handleGuessInputChange}
                        placeholder='Enter Pinyin'
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
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
                        Pinyin format (pinyin+tone): 一 = yi¯
                    </Typography>
                    <br />
                    <Keyboard onKeyPress={handleKeyPress} disableEnter={disableEnter()}/>
                  </div>
                <br />
            </div>
            </>)
            }
        </div>
    );
};

export default App;