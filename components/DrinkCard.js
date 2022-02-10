import { useState } from 'react'
import Image from 'next/image'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { supabase } from '../api'

export default function DrinkCard ({ drinks }) {

    const [checkedState, setCheckedState] = useState(
        new Array(drinks.length).fill(false)
      );

    //   useEffect(()=> {
    //     console.log(checkedState)
    //   }, [checkedState])

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

        if(event.target.checked) {
            addBeverage(event.target)
        } else {
            removeBeverage(event.target)
        }
        console.log(event.target.checked)

        // const updatedCheckedState = checkedState.map((item, index) => {
        //     index === position ? !item : item
        //     // console.log(item)
        // }
        // ); 
        
        // const updatedCheckedState = []
        // for(const i = 0; i < checkedState.length; i++) {
        //     if (i === position) {
        //         updatedCheckedState[i] = !checkedState[i]
        //     } else {
        //         continue
        //     }
        // }
          
        // setCheckedState(updatedCheckedState);
        // console.log(checkedState)
      };

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
            <div id='heart'>
            <input
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
        </>
    );
}