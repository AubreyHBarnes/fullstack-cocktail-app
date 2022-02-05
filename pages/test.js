import { useEffect } from "react";
import axios from "axios";

export default function Test() {

    useEffect(() => {

        // async function fetchData() {
        //     const result = await axios(`https://www.thecocktaildb.com/api/json/v1/1/randomselection.php`)
        //     console.log(result.data.drinks)
        // }

        // fetchData();
        
    }, [])

    return (
        <>
            <h2>yo</h2>
        </>
    );
}