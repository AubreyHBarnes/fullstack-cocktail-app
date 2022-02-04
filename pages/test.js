import { useEffect } from "react";
import axios from "axios";

export default function Test() {

    useEffect(() => {

        async function fetchData() {
            const result = await axios(`https://www.thecocktaildb.com/api/json/v2/9973533/randomselection.php`)
            console.log(result.data.drinks)
        }

        fetchData();
        
    }, [])

    return (
        <>
            <h2>yo</h2>
        </>
    );
}