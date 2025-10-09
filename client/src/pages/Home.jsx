import React from 'react'
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import AiToolCard from '../components/AiToolCard';
import Testimonials from '../components/Testimonials';
import Plan from '../components/Plan';
import Footer from '../components/Footer';
import { useAuth, useUser } from '@clerk/clerk-react';

const Home = () => {
  const {getToken} = useAuth()
  return (
    <div>
      <NavBar />
      <Hero />
      <AiToolCard />
      <Testimonials />
      <Plan />
      <Footer/>
    </div>
  );
}

export default Home
