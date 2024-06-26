"use client";
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders, getCsrfToken } from 'next-auth/react';
import { Typography, Button } from '@material-tailwind/react';
import CharacterDisplay from './CharacterDisplay';
import { signInToMyApp } from '@utils/signInUtil';
import isWebview from 'is-ua-webview';
import LoadingSpinner from './LoadingSpinner';

const sampleCharacter = 
{ character: '小', unicode: '5C0F', bopomofo: 'ㄒㄧㄠˇ', pinyin: 'xiaoˇ', phrase: '小狗', sentence: '小狗很可愛。', image: 'xiao_gou.jpg', translation: 'Small' };

const LandingPage = ({ startGame }) => {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const isUserLoggedIn = !!sessionUser;
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

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
        Format for pinyin is pinyin + tone. Remember ¯ is also a tone in pinyin!
        <br></br>
        Answer: xiaoˇ
        <br></br>
        <br></br>
        If you get 10 in a row you get to keep on playing! Sign in to save progress.
        </Typography>
        <div className='mx-auto pt-6 flex w-max gap-4'>
          { providers && 
            Object.values(providers).map(
              (provider) => ( 
                <Button
                    ripple="light"
                    variant="outlined"
                    key={provider.name}
                    onClick={(e) => {e.preventDefault(); signInToMyApp(provider.id);}}
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