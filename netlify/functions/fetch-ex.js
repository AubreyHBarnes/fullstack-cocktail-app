const axios = require('axios')

exports.handler = async function () {

    const COCKTAIL_SECRET = process.env.COCKTAIL_SECRET

    const cocktailAPI = `https://www.thecocktaildb.com/api/json/v2/${COCKTAIL_SECRET}/randomselection.php`
    
    try {
        const { data } = await axios.get(cocktailAPI)
        return {
          statusCode: 200,
          body: JSON.stringify(data)
          
        }
      } catch (error) {
        const { status, statusText, headers, data } = error.response
        return { 
          statusCode: status,
          body: JSON.stringify({status, statusText, headers, data})
        }
      }
}