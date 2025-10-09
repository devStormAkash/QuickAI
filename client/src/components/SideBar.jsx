import { useUser , UserButton, useClerk, SignedOut, Protect } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Scissors, SquarePen, Image, Users, LogOutIcon } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';


const SideBar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const {signOut , openUserProfile} = useClerk()
  const sideList = [
    {
      to: "/ai",
      label: "Dashboard",
      Icon: House,
    },
    {
      to: "/ai/write-article",
      label: "Write Article",
      Icon: SquarePen,
    },
    {
      to: "/ai/blog-titles",
      label: "Blog Titles",
      Icon: Hash,
    },
    {
      to: "/ai/generate-images",
      label: "Generate Images",
      Icon: Image,
    },
    {
      to: "/ai/remove-background",
      label: "Remove Background",
      Icon: Eraser,
    },
    {
      to: "/ai/remove-object",
      label: "Remove Object",
      Icon: Scissors
    },
    {
      to: "/ai/review-resume",
      label: "Review Resume",
      Icon: FileText
    },
    {
      to: "/ai/community",
      label: "Community",
      Icon: Users
    },
  ];

  return (
    <>
      <div
        className={`z-20 h-[calc(100vh-3.35rem)] flex flex-col items-center justify-between border-r border-gray-300 top-[3.35rem] bottom-0  w-full sm:w-60 bg-white max-sm:absolute ${
          sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="">
          <div className="flex flex-col items-center">
            <img
              src={user.imageUrl}
              alt="userImage"
              className="h-16 w-16 rounded-full mt-4"
            />
            <h2 className="text-xl font-semibold text-gray-700 text-center mt-2">
              {user.fullName}
            </h2>
          </div>
          <div className="my-1 flex flex-col">
            {sideList.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `flex text-gray-500 text-sm items-center hover:bg-gradient-to-r hover:from-indigo-300 hover:to-purple-300 hover:text-white justify-start py-2 px-3 gap-1.5 rounded-md  w-full ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-700 to-purple-800 text-white"
                      : ""
                  } transition-all duration-200`
                }
              >
                <item.Icon className="h-5" />
                <p>{item.label}</p>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex bottom-0 items-center w-full border-t border-gray-300 pt-1.5 justify-around cursor-pointer my-5.5">
          <div
            onClick={openUserProfile}
            className="flex items-center justify-center gap-4"
          >
            <img src={user.imageUrl} alt="" className="size-10 rounded-full" />
            <div className="text-sm">
              <h2 className="text-md font-semibold text-gray-500">
                {user.fullName}
              </h2>
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </div>
          </div>
          <LogOutIcon
            onClick={() => signOut()}
            className="size-5 text-gray-500 hover:text-gray-700 hover:translate-x-1 transition-all duration-500 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}

export default SideBar
