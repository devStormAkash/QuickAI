import {
  FileText,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);
      

      const { data } = await axios.post(
        "/api/ai/review-resume",
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
              <Sparkles className="text-[#12B7AC] size-5" />
              <h1 className="text-xl font-semibold text-gray-500">
                Resume Review
              </h1>
            </div>
            <div className="">
              <label htmlFor="topic"> Upload Resume</label>
              <input
                type="file"
                id="topic"
                className="px-6 py-2 border border-gray-300 rounded-md w-full mt-1 cursor-pointer text-gray-600"
                accept="application/pdf"
                onChange={(e) => setInput(e.target.files[0])}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF resume only
              </p>
            </div>

            <button
              disabled={loading}
              className="cursor-pointer flex items-center justify-center gap-3.5 rounded-md px-6 py-3 w-full bg-linear-to-r from-[#0c746d] to-[#08B6CE]"
            >
              {loading ? (
                <div className="size-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <FileText className="text-white" />
              )}

              <h3 className="text-white ">Review Resume</h3>
            </button>
          </form>
        </div>

        {/* Right part of the page */}
        <div className="md:w-7/12 px-10 py-4  rounded-lg border border-gray-300 bg-zinc-50 min-h-80 max-h-[31.5rem]">
          <div className="flex justify-start items-center gap-3">
            <FileText className="text-[#08B6CE] size-8" />
            <h1 className="text-xl font-semibold text-gray-600">
              Analysis Results
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center px-4 py-6  overflow-y-auto max-h-[23.8rem]">
            {!content && (
              <div className="flex flex-col justify-center items-center mt-25">
                <FileText className="size-12 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Upload your resume and click 'Review Resume' to get started
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
};

export default ReviewResume;
