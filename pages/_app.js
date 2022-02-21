import Link from 'next/link'
import Error from 'next/error'
import { useState, useEffect } from 'react'
import { supabase } from '../api'
import '../styles/globals.css'

function MyApp({ Component, pageProps, statusCode }) {

  if(statusCode !== 200) {
    <Error statusCode={statusCode} />
  }
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
  return (
  <div className='bg-gradient-to-r from-[#25152D] to-[#110E17] text-[#EFEEF7]'>
    <nav className="p-6 border-b border-gray-300">
      <Link href="/">
        <a className="m-6">Home</a>
      </Link>
      {/* {
        user && (
          <Link href="/create-post">
            <a className="m-6">Create Post</a>
          </Link>
        )
      } */}
      {
        user && (
          <Link href="/my-drinks">
            <a className="m-6">My Drinks</a>
          </Link>
        )
      }
      <Link href="/profile">
        <a className="m-6">Profile</a>
      </Link>
    </nav>
    <div className="container p-8 items-center justify-items-center m-auto">
      <Component {...pageProps} />
    </div>
  </div>
  )
}

export default MyApp
