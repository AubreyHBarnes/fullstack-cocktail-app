// pages/my-posts.js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../api'

const axios = require('axios')

export default function MyDrinks() {
  const [drinks, setDrinks] = useState([])
  useEffect(() => {
    fetchUserFaves()
  }, [])

  async function fetchUserFaves() {
    const user = supabase.auth.user()
    const { data } = await supabase
      .from('cocktails')
      .select('*')
      .filter('user_id', 'eq', user.id)
    fetchDrinkData(data)
  }

  async function fetchDrinkData(fetchUrl) {
    const urlArr = await fetchUrl;

    for(const url of urlArr) {
      console.log(url.drinkID)
      axios.get(`/.netlify/functions/fetch-by-id?idQuery=${url.drinkID}`)
        .then(result => console.log(result))

    }
  }


  // async function deletePost(id) {
  //   await supabase
  //     .from('cocktails')
  //     .delete()
  //     .match({ id })
  //   fetchUserFaves()
  // }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Drinks</h1>
      {
        drinks.map((drink, index) => (
          <div key={index} className="border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{drink.url}</h2>
            <p className="text-gray-500 mt-2 mb-2">Author: {drink.user_email}</p>
            {/* <Link href={`/edit-post/${post.id}`}><a className="text-sm mr-4 text-blue-500">Edit Post</a></Link>
            <Link href={`/posts/${post.id}`}><a className="text-sm mr-4 text-blue-500">View Post</a></Link> */}
            {/* <button
              className="text-sm mr-4 text-red-500"
              onClick={() => deletePost(post.id)}
            >Delete Post</button> */}
          </div>
        ))
      }
    </div>
  )
}