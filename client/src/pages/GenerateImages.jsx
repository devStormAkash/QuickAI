import { Edit, FileEditIcon, Image, Sparkles, SquarePen } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const GenerateImages = () => {
  const style = [
    'Realistic' , 'Ghibli Style' , 'Anime Style' , 'Cartoon Style' , 'Fantasy Style' , '3D Style' , 'Watercolor Style' , 'Pixer Style' ,'Pencil Art'
  ];
  const [selectedStyle, setSelectedStyle] = useState(style[0]);
  const [prompt, setPrompt] = useState("");
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageDescription = `Generate a image of ${prompt} in the style of ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt: imageDescription, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  // console.log(publish);
  

  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap justify-center w-full py-10 gap-5 px-10 ">
        {/* Left part of the page */}
        <div className="md:w-5/12">
          <form
            onSubmit={handleSubmit}
            className="bg-white border w-fit  border-gray-300 rounded-lg px-5 py-4 space-y-7 "
          >
            <div className="flex justify-start items-center gap-3">
              <Sparkles className="text-green-500 size-5" />
              <h1 className="text-xl font-semibold text-gray-500">
                AI Image Generator
              </h1>
            </div>
            <div className="">
              <label htmlFor="topic"> Describe your image</label>
              <textarea
                rows={3}
                id="topic"
                placeholder="Describe your image , what you want to see..."
                className="px-6 py-2 border border-gray-300 rounded-md w-full mt-1"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label htmlFor="length">Style</label>
              <div className="flex flex-wrap gap-3 mt-2 ">
                {style.map((item, index) => (
                  <span
                    onClick={() => setSelectedStyle(item)}
                    key={index}
                    className={`hover:scale-110 cursor-pointer px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 ${
                      item === selectedStyle
                        ? "text-green-600 border-teal-600 bg-teal-50"
                        : ""
                    } transition-all duration-300`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-slate-300 rounded-full border border-gray-300 transition peer-checked:bg-green-600"></div>
                <span className="size-3 rounded-full bg-white absolute top-1 left-1 transition peer-checked:translate-x-4"></span>
              </label>
              <p className="mx-2">Make this image public</p>
            </div>
            <button
              disabled={loading}
              className="cursor-pointer flex justify-center gap-3.5 rounded-md px-6 py-3 w-full bg-linear-to-r from-green-700 to-green-400"
            >
              {loading ? (
                <div className="size-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Image className="text-white" />
              )}

              <h3 className="text-white ">Generate Image</h3>
            </button>
          </form>
        </div>

        {/* Right part of the page */}
        <div className="md:w-7/12 px-10 py-4  rounded-lg border border-gray-300 bg-zinc-50 min-h-80 max-h-[31.5rem]">
          <div className="flex justify-start items-center gap-3">
            <Image className="text-green-500 size-8" />
            <h1 className="text-xl font-semibold text-gray-600">
              Generated Image
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center px-4 py-6  overflow-y-auto max-h-[23.8rem]">
            {!content && (
              <div className="flex flex-col justify-center items-center mt-25">
                <Image className="size-12 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Describe an image and click 'Generate Image' to get started
                </p>
              </div>
            )}

            {
              content && (
                <div className="w-full h-full">
                  <img src={content} alt="processed_image" className="rounded-lg"/>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateImages;
