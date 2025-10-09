import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import { SignIn, useUser } from '@clerk/clerk-react'
import SideBar from '../components/SideBar'
import { useState } from 'react'


const Layout = () => {
  const navigate =  useNavigate()
  const { user } = useUser()
  const [sidebar, setSidebar] = useState(false)
  return user ? (
    <>
      <div className="w-full flex flex-col h-screen bg-linear-to-br from-indigo-100 to-blue-50">
        <nav className="py-2.5 bg-white px-4 sm:px-6 border-b border-gray-300">
          <div className="flex  items-center justify-start">
            <img
              onClick={() => navigate("/")}
              src={assets.logo}
              alt="logo"
              className="w-32 sm:w-44 cursor-pointer"
            />
            {sidebar ? (
              <X
                onClick={() => setSidebar(false)}
                className="size-6 sm:hidden"
              />
            ) : (
              <Menu
                onClick={() => setSidebar(true)}
                className="size-6 sm:hidden"
              />
            )}
          </div>
        </nav>
        {/* <div className="h-full flex flex-1 sticky justify-center ">
         
          <SideBar sidebar={sidebar} setSidebar={setSidebar} />
          <div className="flex-1">
            <Outlet />
          </div>
        </div> */}
        <div className="flex flex-1 h-[calc(100vh-3.35rem)] overflow-hidden">
          <SideBar sidebar={sidebar} setSidebar={setSidebar} />
          <div className="flex-1 overflow-y-auto pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}

export default Layout
