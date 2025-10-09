import React, { useEffect } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import toast from 'react-hot-toast';



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {

  const [loading, setLoading] = useState(false)
  const [creations, setCreations] = useState([])
  const { getToken } = useAuth();


  const getCreations = async() => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/users/get-user-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setCreations(data.content)
      }
      else {
        toast.error('No creation presents')
      }
    } catch (error) {
        toast.error(error.message);
      
    }
    setLoading(false)
  }

  useEffect(() => {
    getCreations()
  }, [])
  
  
  
  return loading ? (
    <div className="h-full w-full flex items-center justify-center">
      <span className="size-20 rounded-full border-4 border-t-transparent border-gray-600 animate-spin"></span>
    </div>
  ) : (
    <>
      <div className="flex flex-col h-full items-start px-6 sm:px-10  overflow-y-scroll">
        <div className=" flex justify-start w-full  flex-wrap mt-6 gap-y-3 gap-x-8">
          <div className="flex justify-between px-6 py-3 w-full sm:w-auto border bg-white border-gray-200 rounded-lg max-w-xl">
            <div className="flex flex-col mr-20">
              <p className="text-sm text-gray-500">Total Creations</p>
              <h1 className="text-2xl font-semibold mt-2">
                {creations.length}
              </h1>
            </div>
            <Sparkles
              className={`h-10 w-10 p-2.5 rounded-lg border  text-white`}
              style={{
                background: `linear-gradient(to bottom , #3588F2 , #0BB0D7)`,
              }}
            />
          </div>
          <div className="flex justify-between px-6 py-3 border w-full sm:w-auto bg-white border-gray-200 rounded-lg max-w-xl">
            <div className="flex flex-col mr-20">
              <p className="text-sm text-gray-500">Plan Status</p>
              <h1 className="text-xl font-semibold mt-2">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </h1>
            </div>
            <Gem
              className={`h-10 w-10 p-2.5 rounded-lg border  text-white`}
              style={{
                background: `linear-gradient(to bottom , #B153EA , #E549A3)`,
              }}
            />
          </div>
        </div>
        <h1 className="text-lg mt-6 mb-3">Recent Creations</h1>
        <div className="flex flex-col gap-y-2.5 w-full max-w-3xl mr-auto ">
          {creations.map((creation) => (
            <CreationItem key={creation.id} creation={creation} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard
