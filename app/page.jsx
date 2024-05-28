"use client";
import { cloneDeep, toLower } from 'lodash';
import { useState, useEffect } from 'react';
import { useSession, getCsrfToken } from "next-auth/react";
import Keyboard from '@components/Keyboard';
import CharacterDisplay from '@components/CharacterDisplay';
import GuessInput from '@components/GuessInput';
import GuessHistory from '@components/GuessHistory';
import LoadingSpinner from '@components/LoadingSpinner';
import LevelUpMessage from '@components/LevelUpMessage';
import ContinueMessage from '@components/ContinueMessage';
import LandingPage from '@components/LandingPage';
import SignInDialog from '@components/SignInDialog';
import { loadCharactersAndBuildMap, buildCharactersToDisplay } from '@utils/characterUtils';
import { Typography } from '@material-tailwind/react';
const dailyLimit = 10;
let loading = false;

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [characterMap, setCharacterMap] = useState({});
  const [charactersToDisplay, setCharactersToDisplay] = useState([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [characterToDisplay, setCharacterToDisplay] = useState('');
  const [progress, setProgress] = useState({ characterStartIndex: 0, charactersLearned: [], charactersToReview: [], grade: 1 });
  const [guess, setGuess] = useState('');
  const [attempt, setAttempt] = useState(1);
  const [guessHistory, setGuessHistory] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const [csrfToken, setCsrfToken] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(!open);
  const startGame = () => setGameStarted(!gameStarted);
  const handleGuessInputChange = (event) => {
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

  const updateProgress = async (input) => {
    try {
      const response = await fetch(`/api/users/${user.id}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ ...input }),
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
        body: JSON.stringify({ ...input }),
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = async () => {
    const displayArray = buildCharactersToDisplay(progress, characters, characterMap, dailyLimit);
    const newToday = {
      guessHistory: [],
      charactersArray: displayArray,
      characterIndex: 0
    };

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
  };

  const handleSubmit = async () => {
    const newProgress = cloneDeep(progress);
    const indexOfCharDisplay = newProgress.charactersToReview.findIndex(char => char.character === characterToDisplay.character);
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
    } else if (attempt < 5) {
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

    const tempGuessHistory = [...guessHistory, { ...processedCharacter, attempt }];
    const newToday = {
      guessHistory: tempGuessHistory,
      charactersArray: charactersToDisplay,
      characterIndex: currentCharacterIndex + 1
    };

    const hasCharactersToReview = !!newProgress.charactersToReview.length;

    if (newProgress.characterStartIndex >= characters.length && !hasCharactersToReview) {
      newProgress.grade++;
      newProgress.characterStartIndex = 0;
      const { characters: newCharacters, characterMap: newCharacterMap } = loadCharactersAndBuildMap(newProgress.grade);
      setCharacters(newCharacters);
      setCharacterMap(newCharacterMap);
      setShowLevelUp(true);
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
    if (tempNewToday.characterIndex < charactersToDisplay.length && tempNewToday.characterIndex < dailyLimit) {
      const newCharacterToDisplay = tempNewToday.charactersArray[tempNewToday.characterIndex];
      const newFullChar = characterMap[newCharacterToDisplay.unicode];
      setCharacterToDisplay(newFullChar);
    }
    setGuess('');
    setAttempt(1);
  };

  const disableEnter = () => {
    const correctGuess = toLower(guess) === characterToDisplay.pinyin || (guess === characterToDisplay.bopomofo);
    return attempt >=4 && !correctGuess;
  }

  useEffect(() => {
    async function fetchCsrfToken() {
      const result = await getCsrfToken();
      if (!result) {
        throw new Error('Can not sign in without a CSRF token');
      }
      setCsrfToken(result);
    }

    if (status !== 'loading') {
      fetchCsrfToken();
    }
  }, [status]);

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
    const { characters, characterMap } = loadCharactersAndBuildMap(1);
    setCharacters(characters);
    setCharacterMap(characterMap);
    const defaultDisplayArray = buildCharactersToDisplay(progress, characters, characterMap, dailyLimit);
    setCharactersToDisplay(defaultDisplayArray);
    setCharacterToDisplay(characterMap[defaultDisplayArray[0].unicode]);

    if (user) {
      if (typeof window !== 'undefined') {
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
          const { characters: userCharacters, characterMap: userCharacterMap } = loadCharactersAndBuildMap(tempProgress.grade);
          setCharacters(userCharacters);
          setCharacterMap(userCharacterMap);
          setProgress(tempProgress);

          let displayArray = tempToday?.charactersArray?.length ? tempToday.charactersArray : buildCharactersToDisplay(tempProgress, userCharacters, userCharacterMap, dailyLimit);
          setCharactersToDisplay(displayArray);

          const characterIndex = tempToday.characterIndex || 0;
          setCurrentCharacterIndex(characterIndex);
          if (characterIndex < dailyLimit && characterIndex < displayArray.length) {
            setCharacterToDisplay(userCharacterMap[displayArray[characterIndex].unicode]);
          }

          if (tempToday?.guessHistory?.length) {
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
    }
  }, [user?.id]);

  return (
    <div>
      {!!guessHistory.length && <GuessHistory guessHistory={guessHistory} />}
      { (!user && status !== 'loading' && gameStarted) && <SignInDialog open={open} handleOpen={handleOpen}/> }
      { (!user && status !== 'loading' && !gameStarted) ? <LandingPage startGame={startGame}/> :
        (status === 'loading' || loading) ? <LoadingSpinner /> :
        showLevelUp ? <LevelUpMessage grade={progress.grade} handleNext={handleNext} /> :
          session && currentCharacterIndex >= charactersToDisplay.length && charactersToDisplay.length < dailyLimit ?
            <div><Typography variant="h1">End of Grade {progress.grade}</Typography></div> :
            showContinue ? <ContinueMessage handleNext={handleNext} /> :
              currentCharacterIndex >= dailyLimit ?
                <div><Typography variant="h1">You have reached the daily limit.</Typography></div> :
                <><CharacterDisplay character={characterToDisplay} attempt={attempt} />
                  <div className="text-center flex flex-col items-center m-auto">
                    <br />
                    <GuessInput
                      guess={guess}
                      onChange={handleGuessInputChange}
                      onKeyPress={handleKeyPress}
                      isMobile={isMobile}
                    />
                    <br />
                    <Keyboard onKeyPress={handleKeyPress} disableEnter={disableEnter()} />
                    <br />
                  </div></>
      }
    </div>
  );
};

export default App;
