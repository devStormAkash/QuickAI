import { Download, DownloadIcon, Edit, Eraser, FileEditIcon, Image, Sparkles, SquarePen } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { DownloadButton } from "../components/DownloadButton";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const RemoveBackground = () => {

  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
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
              <Sparkles className="text-orange-500 size-5" />
              <h1 className="text-xl font-semibold text-gray-500">
                Background Removal
              </h1>
            </div>
            <div className="">
              <label htmlFor="topic"> Upload image</label>
              <input
                type="file"
                id="topic"
                className="px-6 py-2 border border-gray-300 rounded-md w-full mt-1 cursor-pointer text-gray-600"
                accept="image/*"
                onChange={(e) => setInput(e.target.files[0])}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports jpg , png , jpeg and all other image formats
              </p>
            </div>

            <button
              disabled={loading}
              className={`cursor-pointer flex justify-center gap-3.5 rounded-md px-6 py-3 w-full bg-linear-to-r from-orange-400 to-orange-700 hover:scale-102 transition-all duration-300 ${
                loading && "opacity-50 cursor-not-allowed"
              } items-center`}
            >
              {loading ? (
                <div className="size-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Eraser className="text-white" />
              )}

              <h3 className="text-white ">Remove Background</h3>
            </button>
          </form>
        </div>

        {/* Right part of the page */}
        <div className="md:w-7/12 px-10 py-4 relative  rounded-lg border border-gray-300 bg-zinc-50 min-h-80 max-h-[31.5rem]">
          <div className="flex justify-start items-center gap-3">
            <Eraser className="text-orange-500 size-8" />
            <h1 className="text-xl font-semibold text-gray-600">
              Processed Image
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center px-4 py-6  overflow-y-auto max-h-[23.8rem]">
            {!content && (
              <div className="flex flex-col justify-center items-center mt-25">
                <Eraser className="size-12 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Upload your image and click 'Remove Background' to get started
                </p>
              </div>
            )}
            {content && (
              <>
                <div className="w-full h-full">
                  <img
                    src={content}
                    alt="removed_background"
                    className="rounded-lg"
                  />
                </div>
                <div className="absolute bottom-4 right-4 p-3 hover:cursor-pointer  rounded-lg bg-gray-300 border text-gray-600 border-gray-400">
                  <DownloadButton url={content} filename="myImage.jpg" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveBackground;
