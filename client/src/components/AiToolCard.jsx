import React, { useEffect, useState } from 'react'
import {AiToolsData} from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { SquarePen,Hash , Image , Eraser, Scissors , FileText } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';


const AiToolCard = () => {

  const navigate = useNavigate()
  console.log(AiToolsData);
  
  const { user } = useUser()
  const {openSignIn} = useClerk()
  // console.log('user is -->',user);
  
  const handleNavigate = (path) => {
    if (user) {
      navigate(path)
    }
    else {
      openSignIn();
    }
  }

  return (
    <div className="mx-auto flex justify-center items-center flex-col mb-20 sm:mb-40">
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold text-gray-700 leading-[1.2] my-3.5">
        Powerful AI Tools
      </h1>
      <p className=" text-gray-500  text-center my-3 max-w-xs sm:max-w-lg 2xl:max-w-xl mb-8">
        Everything you need to create , enchance , optimize your content with
        cutting-edge AI Technology
      </p>
      <div className="flex justify-center flex-wrap gap-6 mx-20">
        {AiToolsData.map((tool, index) => (
          <div
            onClick={()=> handleNavigate(tool.path)}
            key={index}
            className="flex flex-col border border-gray-200 max-w-xs float-start  rounded-lg px-4 py-3.5 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer shadow-xl"
          >
            <tool.Icon
              className={`h-8 w-8 p-1.5 rounded-xl border border-gray-300 text-white`}
              style={{
                background: `linear-gradient(to bottom , ${tool.bg.from} , ${tool.bg.to})`,
              }}
            />

            <h2 className="text-xl font-semibold mt-2">{tool.title}</h2>
            <p className="text-gray-600 my-2">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiToolCard
