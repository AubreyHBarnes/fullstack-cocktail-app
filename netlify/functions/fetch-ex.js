exports.handler = async function () {

    const cocktailAPI = `https://www.themealdb.com/api/json/v2/${process.env.COCKTAIL_SECRET}/latest.php`
    
    const res = await fetch(cocktailAPI);
    const data = await res.json();

    console.log(data)

    return {
        statusCode: 200, 
        body: JSON.stringify(data)
    }
}