import React from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { useState,useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast, { ToastBar } from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;



const Community = () => {

  const {user} = useUser()
  const [Creations, setCreations] = useState([]);
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const fetchCreations = async() => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/users/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setCreations(data.content);
      }
      else {
        toast.error('No creation present')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  };


  const imageLikeToggle = async(id) => {
    try {
      const { data } = await axios.post("/api/users/toggle-liked-creations", {id} , {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success(`Image liked by ${user.firstName}`);
        await fetchCreations()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  


  useEffect(() => {
    fetchCreations();
  }, [user]);
  return loading ? (<div className="h-full w-full flex items-center justify-center">
    <span className='size-20 rounded-full border-4 border-t-transparent border-gray-600 animate-spin'></span>
  </div> ) : (
    <>
      <div className="flex-1 h-full flex flex-col items-start gap-4 p-6">
        <h1 className="text-2xl font-semibold text-gray-600">Creations</h1>
        <div className="flex flex-wrap gap-4 h-full w-full overflow-y-scroll">
          {Creations.map((item) =>
            item.type === "image" ? (
              <div
                key={item.id}
                className="relative group inline-block w-fit h-fit"
              >
                <img
                  src={item.content}
                  alt="public_photo"
                  className="h-72 rounded-md shadow-md object-cover"
                />
                <div className="absolute flex items-end justify-center  gap-2.5 w-full h-full inset-0  rounded-md group-hover:bg-gradient-to-b from-transparent to-black/80 text-white">
                  <div className="flex items-end py-3 px-3">
                    <div className="">
                      <p className="text-sm  px-5 py-4 hidden group-hover:block">
                        {item.prompt}
                      </p>
                    </div>
                    <div className="group-hover:block items-center gap-1.5 hidden">
                      <div className="flex items-center gap-2">
                        <Heart
                          onClick={()=> imageLikeToggle(item.id)}
                          className={`cursor-pointer size-5 ${
                            item.likes.includes(user.id)
                              ? "fill-red-600 text-red-600"
                              : "text-white"
                          }`}
                        />

                        <p>{item.likes.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Community
