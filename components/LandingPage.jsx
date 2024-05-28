"use client";
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { Typography, Button } from '@material-tailwind/react';
import CharacterDisplay from './CharacterDisplay';

const sampleCharacter = 
{
    character: "五",
    unicode: "4E94",
    bopomofo: "ㄨˇ",
    pinyin: "wǔ",
    phrase: "五個",
    sentence: "我有五個蘋果。",
    image: "five_apples.jpg",
    translation: "Five"
};

const LandingPage = ({ startGame }) => {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const isUserLoggedIn = !!sessionUser;
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }
    setUpProviders();
  }, []);
  return (
    <div className="m-4">
        <Typography className="text-center" variant="h3">
            How to play
        </Typography>
        <Typography className="pb-6" variant="h5">
           Guess the pinyin of the character in 3 attempts.
        </Typography>
        <CharacterDisplay character={sampleCharacter} attempt={1} />
        <Typography className="pt-6" variant="h5">
        Format for pinyin is pinyin + tone. 
        <br></br>
        Answer: wuˇ
        <br></br>
        <br></br>
        If you get 10 in a row you get to keep on playing!
        </Typography>
        <div className='mx-auto pt-6 flex w-max gap-4'>
          { providers && 
            Object.values(providers).map(
              (provider) => ( 
                <Button
                    ripple="light"
                    variant="outlined"
                    key={provider.name}
                    onClick={(e) => {e.preventDefault(); signIn(provider.id);}}
                >
                Sign In
                </Button>))
            }
            <Button
                ripple="light"
                onClick={startGame}
                >
            Play
            </Button>
        </div>
    </div>
  )
}

export default LandingPage