
import { useState, useEffect } from 'react'
import Image from 'next/image'
import DrinkCard from './DrinkCard'

const axios = require('axios')

export default function PopularDrinks() {
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
    // const urlArr = await fetchUrl;
    const pushArr = [];

    await axios.get(`/.netlify/functions/fetch-popular`)
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
          loading ? <>
          <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
            <div className="w-[275px] bg-gray-300 h-[275px] rounded-xl"></div>
          </div>
          <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
            <div className="w-[275px] bg-gray-300 h-[275px] rounded-xl"></div>
          </div>
          <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
            <div className="w-[275px] bg-gray-300 h-[275px] rounded-xl"></div>
          </div>
          <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
            <div className="w-[275px] bg-gray-300 h-[275px] rounded-xl"></div>
          </div>
      </>
                : <DrinkCard drinks={drinks}/>
        }
    </>
  )
}