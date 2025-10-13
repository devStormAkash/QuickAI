import { Edit, FileDown, FileEditIcon, Hash, Sparkles, SquarePen } from "lucide-react";
import React, { useState } from "react";
import axios from 'axios'
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const category = [
    'General' , 'Technology' ,'Business' , 'Health' , 'Lifestyle' ,'Education' ,'Travel' ,'Food'
  ];
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false)
  const { getToken } = useAuth();



  const downloadPDF = async (markdownText) => {
    if (!markdownText) return toast.error("No content to download as PDF");
    setPdfLoading(true);
    const token = await getToken();

    const response = await axios.post(
      "/api/users/generate-pdf",
      { markdown: markdownText }, // body data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 👈 this tells Axios to expect binary data
      }
    );

    // Convert the binary PDF to a downloadable blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.split(" ").join("-")}${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    setPdfLoading(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const blog = `Generate a blog title for the keyword ${prompt} in the category ${selectedCategory}`
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt: blog },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content)
        console.log( "The content is" ,content);
        
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  };

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
              <Sparkles className="text-purple-600 size-5" />
              <h1 className="text-xl font-semibold text-gray-500">
                AI Title Generator
              </h1>
            </div>
            <div className="">
              <label htmlFor="topic">Keyword</label>
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
              <label htmlFor="length">Category</label>
              <div className="flex flex-wrap gap-3 mt-2 ">
                {category.map((item, index) => (
                  <span
                    onClick={() => setSelectedCategory(item)}
                    key={index}
                    className={`hover:scale-110 cursor-pointer text-xs px-3 py-1 border border-gray-200 rounded-full  text-gray-500 ${
                      item === selectedCategory
                        ? "text-purple-700 border-purple-600 bg-purple-100"
                        : ""
                    } transition-all duration-300`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <button
              disabled={loading}
              className={`cursor-pointer flex hover:scale-102 transition-all duration-300 ${
                loading && "opacity-50 cursor-not-allowed"
              } justify-center gap-3.5 rounded-md px-6 py-3 w-full bg-linear-to-r from-purple-500 to-purple-900`}
            >
              {loading ? (
                <div className="size-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Hash className="text-white" />
              )}

              <h3 className="text-white ">Generate Title</h3>
            </button>
          </form>
        </div>

        {/* Right part of the page */}
        <div className="md:w-7/12 px-10 py-4  relative rounded-lg border border-gray-300 bg-zinc-50 min-h-80 max-h-[31.5rem]">
          <div className="flex justify-start items-center gap-3">
            <Hash className="text-purple-600 size-8" />
            <h1 className="text-xl font-semibold text-gray-600">
              Generated Article
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center px-4 py-6  overflow-y-auto max-h-[23.8rem]">
            {!content && (
              <div className="flex flex-col justify-center items-center mt-25">
                <Hash className="size-12 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Enter Keywords and click 'Generate Title' to get started
                </p>
              </div>
            )}
            {content && (
              <>
                <div className="flex flex-col  justify-start items-start  overflow-y-auto">
                  <div className="reset-tw">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
                <div
                  className={`px-2 pt-2 ${
                    pdfLoading ? "pb-2" : "pb-1"
                  } absolute right-4 top-4 rounded-lg  bg-gray-300 border border-gray-400`}
                >
                  {pdfLoading ? (
                    <div className="size-5 rounded-full border-2 border-t-transparent border-black animate-spin"></div>
                  ) : (
                    <button
                      className="cursor-pointer"
                      onClick={() => downloadPDF(content)}
                    >
                      <FileDown />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogTitles;
