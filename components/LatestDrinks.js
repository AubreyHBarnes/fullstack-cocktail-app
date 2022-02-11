
import { useState, useEffect } from 'react'
import DrinkCard from './DrinkCard'

const axios = require('axios')

export default function LatestDrinks() {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDrinkData()
    }, [])

  useEffect(() => {
    //on page load, query DB
    if (drinks.length > 0) {
        setLoading(false)
    }
    
  }, [drinks])

  async function fetchDrinkData() {
    const pushArr = [];

    await axios.get(`/.netlify/functions/fetch-latest`)
        .then(result => {
            for (let i = 0; i < result.data.drinks.length; i++) {
                pushArr.push(result.data.drinks[i])
            }
        })
    setDrinks(pushArr)
  }


  return (
    <>
        {
            loading ? <p>Loading...</p> : <DrinkCard drinks={drinks}/>
        }
    </>
  )
}