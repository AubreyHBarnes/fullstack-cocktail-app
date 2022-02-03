import { useEffect } from "react";
import axios from "axios";

export default function Test() {

    useEffect(() => {

        async function fetchData() {
            const result = await axios('/.netlify/functions/fetch-ex')
            console.log(result.data)
        }

        fetchData();
        
    }, [])

    return (
        <>
            <h2>yo</h2>
        </>
    );
}