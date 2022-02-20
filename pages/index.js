import { useState, useEffect } from 'react'
import { supabase } from '../api'
import RandomTen from '../components/RandomTen'
import LatestDrinks from '../components/LatestDrinks'
import PopularDrinks from '../components/PopularDrinks'

export default function Home(pageProps) {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(checkUser)
    checkUser()
    return () => {
      authListener?.unsubscribe()
    };
  }, [])
  function checkUser() {
    const user = supabase.auth.user()
    setUser(user)
  }
  useEffect(() => {
    fetchPosts()
    const mySubscription = supabase
      .from('cocktails')
      .on('*', () => {
        console.log('something happened....')
        fetchPosts()
      })
      .subscribe()
    return () => supabase.removeSubscription(mySubscription)
  }, [])
  async function fetchPosts() {
    
    setLoading(false)
  }
  
   return (
    <>
      <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Random Selection</h3>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
        <RandomTen />
      </div>
      <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Latest Drinks</h3>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
        <LatestDrinks />
      </div>
      <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Popular Drinks</h3>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
        <PopularDrinks />
      </div>
      
    </>
  );
  
}