"use client";

import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { signInToMyApp } from '@utils/signInUtil';

const Nav = () => {
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
    <nav className="flex-between w-full mb-4 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image 
          alt="Ghen Logo"
          src="/assets/images/translate.svg"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Ghen</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        { isUserLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            {/* <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link> */}
            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>

            <Link href="/profile">
              <Image 
                src={sessionUser.image}
                width={37}
                height={37}
                className="rounded-full cursor-pointer"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            { status !== 'loading' && providers && 
            Object.values(providers).map(
              (provider) => ( 
                <button 
                  type="button" 
                  key={provider.name}
                  onClick={(e) => {e.preventDefault(); signInToMyApp(provider.id);}}
                  className="black_btn"
                  >
                Sign In
              </button>))
            }
          </>
        )}
      </div>
      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        { isUserLoggedIn ? (
          <div className="flex">
            <Image 
                src={sessionUser.image}
                width={37}
                height={37}
                className="rounded-full cursor-pointer"
                alt="profile"
                onClick={ () => setToggleDropdown((prev) => !prev)}
              />
              { toggleDropdown && (
                <div className="dropdown">
                    <Link
                      href="/profile"
                      className="dropdown_link"
                      onClick={() => setToggleDropdown(false)}
                    >
                      My Profile
                    </Link>
                    {/* <Link
                      href="/create-prompt"
                      className="dropdown_link"
                      onClick={() => setToggleDropdown(false)}
                    >
                      Create Prompt
                    </Link> */}
                    <button
                      type="button"
                      onClick={() => {
                        setToggleDropdown(false);
                        signOut();
                      }}
                      className="mt-5 w-full black_btn"
                    >
                      Sign Out
                    </button>
                </div>
              )}
          </div>
        ) : (
          <>
            { status !== 'loading' && providers && 
            Object.values(providers).map(
              (provider) => ( 
                <button 
                  type="button" 
                  key={provider.name}
                  onClick={(e) => {e.preventDefault(); signInToMyApp(provider.id);}}
                  className="black_btn"
                  >
                Sign In
              </button>))
            }
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav