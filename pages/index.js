import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../api'
import RandomTen from '../components/RandomTen'

export default function Home(pageProps) {

  // const [posts, setPosts] = useState([])
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
    // const { data, error } = await supabase
    //   .from('cocktails')
    //   .select()
    // setPosts(data)
    setLoading(false)
  }
  if (loading) return <p className="text-2xl">Loading ...</p>
  if (user) return (
    <>
    <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Drinks</h1>
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
      <RandomTen />
    </div>
      
    </>
  );
  if (!user) return <p>lol oop</p>
}