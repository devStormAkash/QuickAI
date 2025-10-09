import React from 'react'

import { ArrowRight } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useClerk, UserButton , useUser } from '@clerk/clerk-react';
const NavBar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const {openSignIn} = useClerk()
  return (
    <>
      <div className="border-b border-gray-300 flex items-center justify-between fixed backdrop-blur-2xl cursor-pointer z-5 sm:px-20  xl:px-32 px-3 py-3 w-full">
        <img
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44"
          onClick={() => navigate("/")}
        />
        {user ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "40px",
                  height: "40px",
                },
              },
            }}
          />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="flex justify-center gap-2 px-6 py-2 rounded-full cursor-pointer bg-primary text-white "
          >
            <span>Get Started</span>
            <ArrowRight />
          </button>
        )}
      </div>
    </>
  );
}

export default NavBar
