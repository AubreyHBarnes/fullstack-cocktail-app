import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { supabase } from '../api'
import { Router } from 'next/router'
import { useEffect } from 'react'

const axios = require('axios')

export default function DrinkCard ({ drinks }) {
    const router = useRouter()

    let [isOpen, setIsOpen] = useState(false)
    let [details, setDetails] = useState('')
    // let [ingredientArr, setIngredientArr] = useState([])
    // let [MeasureArr, setMeasureArr] = useState([])
    let [measuredIngredients, setMeasuredIngredients] = useState([])


    useEffect(() => {

        let addIngredient = []
        let addMeasurement = []
        let recipeItems = []
        
        for (const [key, value] of Object.entries(details)) {
            if (key.includes('Ingredient') && value !== null) {
                addIngredient.push(value);
            }
            if (key.includes('Measure') && value !== null) {
                addMeasurement.push(value);
            }
          }

          //There must be more ingredients than measurements, due to some ingredients not having measurements.
          //Thus, we'll go off of the length of addIngredient
        for (let i = 0; i < addIngredient.length; i++) {
            if (addMeasurement[i] === undefined){
                recipeItems[i] = addIngredient[i]
            } else {
                recipeItems[i] = addMeasurement[i].concat(' ', addIngredient[i]);
            }            
        }
        setMeasuredIngredients(recipeItems)

    }, [details])

    function closeModal() {
        setIsOpen(false)
    }

     async function openModal(getDetails) {
        try {
            await axios.get(`/.netlify/functions/fetch-by-id?idQuery=${getDetails}`)
              .then(result => setDetails(result.data.drinks[0]))
    
          } catch (error) {
            console.error(error)
          } 

        setIsOpen(true)
    }

    const addBeverage = async (addMe) => {

        const user = supabase.auth.user()
        
        const { data } = await supabase
        .from('cocktails')
        .insert([
            { user_id: user.id, user_email: user.email, drinkID: addMe.id }
        ])
        .single()
    }

    const removeBeverage = async (removeMe) => {
        const user = supabase.auth.user()
        const thisOne = removeMe.id
        await supabase
      .from('cocktails')
      .delete()
      .match({ user_id: user.id, drinkID: thisOne })
    }

      const handleOnChange = (event) => {
        const user = supabase.auth.user()
        

        if (user) {event.target.checked ? addBeverage(event.target) : removeBeverage(event.target)} else {router.push('/profile')}
      };
    
    return (
        <>
        
            {        
                drinks.map((drink, index) => (
                <div key={index} onClick={() => openModal(drink.idDrink)} className="relative border-gray-300 rounded-xl mt-8 pb-4">
                    <p className="absolute bottom-8 left-4 z-10 backdrop-blur-xl bg-opacity-30 bg-black text-white px-4 py-2 rounded-lg">{drink.strDrink}</p>
                    <Image
                        className='rounded-xl'
                        src={drink.strDrinkThumb}
                        alt="Moon" 
                        width={500}
                        height={500}
                        priority

                    />
                    <div id='heart' className='absolute top-4 right-12'>
                        <input
                            className='invisible'
                            type="checkbox"
                            id={drink.idDrink}
                            name={drink.strDrink}
                            value={drink.idDrink}
                            // checked={checkedState[index]}
                            onChange={(event) => handleOnChange(event)}
                        />
                    </div>
                    
                </div>

                
                ))
                
            }

            
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
                >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                    >
                    &#8203;
                    </span>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    <div className="relative inline-block w-full max-w-md  my-8 pb-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <Image
                            className='rounded-xl'
                            src={details.strDrinkThumb}
                            alt="Moon" 
                            width={500}
                            height={500}

                            priority

                        />
                        <section className='modal-body-container p-8'>

                            <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                            >
                            {details.strDrink}
                            </Dialog.Title>
                            <div className="mt-2 flex justify-evenly">
                                <p className="text-sm text-center text-gray-500">Glass Type<span className='block text-center'>{details.strGlass}</span></p>
                                <p className="text-sm text-center text-gray-500">Drink Type<span className='block text-center'>{details.strCategory}</span></p>
                            </div>
                            <div className='ingredients-container '>
                                <h4>Ingredients</h4>
                                <div className='grid grid-cols-3'>
                                    {
                                        measuredIngredients.map((ingredient, index) => (
                                                <p key={ingredient + index}>{ingredient}</p>
                                            ))

                                        
                                    }

                                    {}
                                </div>
                            </div>
                            <div className='directions-container'>
                                <h4>Instructions</h4>
                                <p>{details.strInstructions}</p>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={closeModal}
                                >
                                    Got it, thanks!
                                </button>
                            
                            </div>
                        </section>
                    </div>
                    
                    </Transition.Child>
                    
                </div>
                
                </Dialog>
            </Transition>
        </>
    );
}

export function FavCard ({ drinks }) {
    const router = useRouter()
    const [isChecked, setIsChecked] = useState(true)

    const addBeverage = async (addMe) => {

        const user = supabase.auth.user()
        
        await supabase
        .from('cocktails')
        .insert([
            { user_id: user.id, user_email: user.email, drinkID: addMe.id }
        ])
        .single()
    }

    const removeBeverage = async (removeMe) => {
        const user = supabase.auth.user()
        const thisOne = removeMe.id
        await supabase
      .from('cocktails')
      .delete()
      .match({ user_id: user.id, drinkID: thisOne })
    }


    const handleOnChange = (event) => {
        const user = supabase.auth.user()
        
        //if a user is logged in, add beverage to favorites, if not logged in, go to signup page
        if (user) {event.target.checked ? addBeverage(event.target) : removeBeverage(event.target)} else {Router.push('/profile')}
        
      };

    return(
        <>
            {        
                drinks.map((drink, index) => (
                <div key={index} className="relative rounded-xl mt-8 pb-4">
                    <p className="absolute bottom-8 left-4 z-10 backdrop-blur-xl bg-opacity-30 bg-black text-white px-4 py-2 rounded-lg">{drink.strDrink}</p>
                    <Image
                        className='rounded-xl'
                        src={drink.strDrinkThumb}
                        alt="Moon" 
                        width={500}
                        height={500}
                        priority

                    />
                    <div id='heart' className='absolute top-4 right-12'>
                        <input
                            className='invisible'
                            type="checkbox"
                            id={drink.idDrink}
                            name={drink.strDrink}
                            value={drink.idDrink}
                            defaultChecked={isChecked}
                            onChange={(event) => {handleOnChange(event)}}
                        />
                    </div>
                    
                </div>
                ))
            }
        </>
    );
}