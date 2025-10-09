import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full min-h-screen flex-col relative inline-flex justify-center items-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat">
        <h1 className="text-3xl sm:text-5xl md:text-6xl text-center font-semibold leading-[1.2]">
          Create amazing contents <br /> with{" "}
          <span className="text-primary">AI tools</span>
        </h1>
        <p className=" text-gray-500  text-center my-3 mx-3 max-w-xs sm:max-w-lg 2xl:max-w-xl">
          Transform your content creation with our suite of premium AI tools.
          Write Articles , Generate Images , Remove Image background ,
          Review Resume and enhance your workflow.
        </p>
        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 my-4">
          <button
            onClick={() => navigate("/ai")}
            className="px-5 py-2 rounded-lg text-white bg-primary cursor-pointer"
          >
            Start creating now
          </button>
          <button
            onClick={() => navigate("/ai")}
            className="px-5 py-2 rounded-lg bg-gray-100 border border-gray-400 cursor-pointer"
          >
            Watch demo
          </button>
        </div>
        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 mt-6">
          <img
            src={assets.user_group}
            alt="user_group"
            className="w-20 sm:w-32"
          />
          <p className=" text-gray-600 ">Trusted by 10k+ people</p>
        </div>
      </div>
    </>
  );
}

export default Hero
