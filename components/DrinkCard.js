import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useRef } from 'react'
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
    const [isChecked, setIsChecked] = useState(
        new Array(drinks.length).fill(false)
    )
    let [measuredIngredients, setMeasuredIngredients] = useState([])

    let completeButtonRef = useRef(null)

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
        console.log(recipeItems)
        setMeasuredIngredients(recipeItems)

    }, [details])

    useEffect(()=> {

        if (router.pathname.includes('my-drinks')) {
            const defaultChecked = new Array(drinks.length).fill(true)
            setIsChecked(defaultChecked)
        }
    }, [router.pathname])

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

      const handleOnChange = (event, position) => {
        const user = supabase.auth.user()        

        if (user) {event.target.checked ? addBeverage(event.target) : removeBeverage(event.target)} else {router.push('/profile')}

        const updatedCheckedState = isChecked.map((item, index) =>
        index === position ? !item : item
        );

        setIsChecked(updatedCheckedState);
      };
    
    return (
        <>
            {        
                drinks.map((drink, index) => (
                <div key={index} className='card-container relative'>
                    <div onClick={() => openModal(drink.idDrink)} className="relative border-gray-300 rounded-xl mt-8 pb-4">
                        <p className="absolute bottom-8 left-4 z-10 backdrop-blur-xl bg-opacity-30 bg-black text-white px-4 py-2 rounded-lg">{drink.strDrink}</p>
                        <Image
                            className='rounded-xl'
                            src={drink.strDrinkThumb}
                            alt="Moon" 
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                    <div id='heart' className='absolute z-10 top-12 right-12'>
                            <input
                                className='invisible'
                                type="checkbox"
                                id={drink.idDrink}
                                name={drink.strDrink}
                                value={drink.idDrink}
                                checked={isChecked[index]}
                                onChange={(event) => handleOnChange(event, index)}
                            />
                    </div>
                </div>

                
                ))
                
            }

            
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                initialFocus={completeButtonRef}
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto "
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
                    <div className="bg-transparent relative inline-block w-full max-w-md  my-8 text-left align-middle transition-all transform shadow-xl">
                        <Image
                            className='rounded-t-xl'
                            src={details.strDrinkThumb}
                            alt="Moon" 
                            layout='responsive'
                            width={500}
                            height={500}
                            objectFit='cover'
                        />
                        <div id='close' ref={completeButtonRef} className='absolute z-10 top-12 left-12 font-bold text-2xl cursor-pointer' onClick={closeModal}>X</div>
                        <div id='heart' className='absolute z-10 top-12 right-12'>
                            <input
                                className='invisible'
                                type="checkbox"
                                id={details.idDrink}
                                name={details.strDrink}
                                value={details.idDrink}
                                checked={router.pathname === '/my-drinks' ? true : null}
                                // checked={isChecked}
                                onChange={(event) => handleOnChange(event, index)}
                            />
                        </div>
                        <section className='modal-body-container rounded-t-xl -translate-y-4 bg-gradient-to-b from-[#25152D] to-[#110E17] text-[#EFEEF7] p-8'>

                            <Dialog.Title
                            as="h3"
                            className="text-4xl py-8 text-center font-medium leading-6 font-Libre"
                            >
                            {details.strDrink}
                            </Dialog.Title>
                            <div className="mt-2 flex justify-evenly">
                                <p className="text-xl text-center text-gray-500 font-Ubuntu">Glass Type<span className='block text-center text-[#EAD58F]'>{details.strGlass}</span></p>
                                <p className="text-xl text-center text-gray-500 font-Ubuntu">Drink Type<span className='block text-center text-[#EAD58F]'>{details.strCategory}</span></p>
                            </div>
                            <div className='ingredients-container '>
                                <h4 className='font-Ubuntu text-2xl p-4'>Ingredients</h4>
                                <div className='grid grid-cols-3 place-items-stretch justify-center text-center gap-3'>
                                    {
                                        measuredIngredients.map((ingredient, index) => (
                                                ingredient !== ' ' ? <p key={ingredient + index} className='font-Ubuntu text-lg grid rounded-xl p-4 place-items-center bg-[#211E27]'>{ingredient}</p> 
                                                                   : null
                                            )) 
                                    }
                                </div>
                            </div>
                            <div className='directions-container'>
                                <h4 className='font-Ubuntu text-2xl p-4'>Instructions</h4>
                                <p className='font-Ubuntu text-xl py-8'>{details.strInstructions}</p>
                            </div>

                            {/* <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={closeModal}
                                >
                                    Got it, thanks!
                                </button>
                            
                            </div> */}
                        </section>
                    </div>
                    
                    </Transition.Child>
                    
                </div>
                
                </Dialog>
            </Transition>
        </>
    );
}

