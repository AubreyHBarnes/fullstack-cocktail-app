// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const axios = require('axios')

const handler = async (event) => {

  const API_SECRET = process.env.API_SECRET
  const idQuery = event.queryStringParameters.idQuery
  const url = `https://www.thecocktaildb.com/api/json/v2/${API_SECRET}/lookup.php?i=${idQuery}`

  try {
    const { data } = await axios.get(url)
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

module.exports = { handler }