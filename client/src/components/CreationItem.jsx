import React, { useState } from 'react'
import Markdown from "react-markdown";

const CreationItem = ({ creation }) => {
  const [hide, setHide] = useState(true);
  return (
    <>
      <div className="w-full px-6 py-3 rounded-lg flex flex-col gap-y-3 bg-white cursor-pointer text-sm shadow-md border border-gray-200 hover:-translate-y-0.5 hover:scale-101 transition-all duration-300">
        <div
          onClick={() => setHide(!hide)}
          className="flex justify-between gap-4"
        >
          <div className="flex flex-col">
            <h2 className="text-lg text-gray-600 font-semibold">
              {creation.prompt}
            </h2>
            <p className="text-sm text-gray-400">
              {new Date(creation.created_at).toLocaleString()}
            </p>
          </div>
          <div className="px-4 py-2 border-indigo-400 h-fit rounded-full bg-blue-100">
            {creation.type}
          </div>
        </div>
        {!hide && (
          <div className="">
            {creation.type === "image" ? (
              <img
                src={creation.content}
                alt="image"
                className="w-full max-w-md mt-3"
              />
            ) : (
              <div
                className={`px-4 py-3 overflow-y-scroll h-full w-full text-sm max-h-96`}
              >
                <div className="reset-tw">
                  <Markdown>{creation.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CreationItem
