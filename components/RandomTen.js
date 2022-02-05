
import { useState, useEffect } from 'react'
import Image from 'next/image'

const axios = require('axios')

export default function RandomTen() {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDrinkData()
    }, [])

  useEffect(() => {
    //on page load, query DB
    setLoading(false)
    console.log(drinks)
  }, [drinks])

  async function fetchDrinkData() {
    // const urlArr = await fetchUrl;
    const pushArr = [];

    await axios.get(`/.netlify/functions/fetch-rand-ten`)
        .then(result => {
            for (let i = 0; i < result.data.drinks.length; i++) {
                pushArr.push(result.data.drinks[i])
            }
        })
    setDrinks(pushArr)
  }

  if (loading) return <p>Loading...</p>
  return (
    <>
      
      {        
        drinks.map((drink, index) => (
          <div key={index} className="relative border-gray-300 rounded-xl mt-8 pb-4">
            <p className="absolute bottom-8 left-4 z-10 backdrop-blur-xl bg-opacity-30 bg-black text-white px-4 py-2 rounded-lg">{drink.strDrink}</p>
            <Image
                    className='rounded-xl'
                    src={drink.strDrinkThumb}
                    alt="Moon" 
                    width={500}
                    height={500}
                    priority

            />
            <div id='heart'></div>
            
          </div>
        ))
      }
    </>
  )
}