import { useState, useEffect } from 'react'
import { supabase } from '../api'
import DrinkCard from '../components/DrinkCard'

const axios = require('axios')

export default function MyDrinks() {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //on page load, query DB
    fetchUserFaves()
  }, [])

  useEffect(() => {

    setLoading(false)
  }, [drinks])



  async function fetchUserFaves() {
    //Retrieve everything under the current logged in user
    const user = supabase.auth.user()
    if (user) {
      const { data } = await supabase
        .from('cocktails')
        .select('*')
        .filter('user_id', 'eq', user.id)

      fetchDrinkData(data)
    } else {
      console.log('nah')
    }    
  }

  async function fetchDrinkData(fetchUrl) {
    const urlArr = await fetchUrl;
    const pushArr = [];
    //for every drink under current user, we lookup each drink by drinkid in the 3rd party api
    for(const url of urlArr) {
      try {
        await axios.get(`/.netlify/functions/fetch-by-id?idQuery=${url.drinkID}`)
          .then(result => pushArr.push(result.data.drinks[0]))

      } catch (error) {
        console.error(error)
      } 
    }
    setDrinks(pushArr)
  }

  if (loading) return <p>Retrieving favorites...</p>
  return (
    <>
      {
          drinks.length === 0 ? <p>No favorites found.</p> : 
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
            <DrinkCard drinks={drinks} />
        </div>
      }
    </>
  )
}