import { Edit, FileEditIcon, Sparkles, SquarePen } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const WriteArticle = () => {
  const articleLength = [
    { length: 600, text: "Short(400-600) words" },
    { length: 1200, text: "Medium(600-1200) words" },
    { length: 1600, text: "Essay(1200+) words" },
  ];
  const [selectedlength, setSelectedLength] = useState(articleLength[0])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const {getToken}  = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const articlePrompt = `Write an article about ${prompt} in ${selectedlength.text}`
      const { data } = await axios.post("/api/ai/generate-article", { prompt : articlePrompt, length: selectedlength.length }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }

      }catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  


  return (
    <>
      <div className="flex h-full flex-wrap md:flex-nowrap justify-center w-full py-10 gap-5 px-10">
        {/* Left part of the page */}
        <div className="md:w-5/12">
          <form
            onSubmit={handleSubmit}
            className="bg-white border w-fit  border-gray-300 rounded-lg px-5 py-4 space-y-7 "
          >
            <div className="flex justify-start items-center gap-3">
              <Sparkles className="text-[#3588F2] size-5" />
              <h1 className="text-xl font-semibold text-gray-500">
                AI Article Configuration
              </h1>
            </div>
            <div className="">
              <label htmlFor="topic">Article Topic</label>
              <input
                type="text"
                id="topic"
                placeholder="The future of artificial intelligence..."
                className="px-6 py-2 border border-gray-300 rounded-md w-full mt-1"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label htmlFor="length">Article Length</label>
              <div className="flex flex-wrap gap-3 mt-2 ">
                {articleLength.map((item, index) => (
                  <span
                    onClick={() => setSelectedLength(item)}
                    key={index}
                    className={`hover:scale-110 cursor-pointer  px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 ${
                      item.text === selectedlength.text
                        ? "text-indigo-600 border-indigo-600 bg-indigo-50"
                        : ""
                    } transition-all duration-300`}
                  >
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
            <button disabled={loading} className="cursor-pointer flex justify-center gap-3.5 rounded-md px-3 py-3 w-full bg-linear-to-r from-[#164c99] to-[#0BB0D7]">
              {loading ? (
                <div className="size-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <SquarePen className="text-white" />
              )}
              <h3 className="text-white ">Generate Article</h3>
            </button>
          </form>
        </div>

        {/* Right part of the page */}
        <div className="md:w-7/12 px-10 py-4  rounded-lg border border-gray-300 bg-zinc-50 min-h-80 max-h-[31.5rem]">
          <div className="flex justify-start items-center gap-3">
            <Edit className="text-[#3588F2] size-8" />
            <h1 className="text-xl font-semibold text-gray-600">
              Generated Article
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center px-4 py-6  overflow-y-auto max-h-[23.8rem]">
            {!content && (
              <div className="flex flex-col justify-center items-center mt-25">
                <FileEditIcon className="size-12 text-gray-500" />

                <p className="text-sm text-gray-500">
                  Enter a topic and click 'Generate Article' to get started
                </p>
              </div>
            )}
            {content && (
              <div className="flex flex-col  justify-start items-start  overflow-y-auto">
                <div className="reset-tw">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default WriteArticle
