
const { Spot } = require('@binance/connector')

const apiKey = 'oiZGGuCWfq822ZDpGWQBxOXHIQBFgRJGuQ6zoqEWE0vWtUwW7QLHkdrcnA5qcQuP'
const apiSecret = 'siDUHi81WsTXyeFEmbBmBxt0sMSG1SPWl1a69q60AUfoh09FZwo8yoUrrn2vpEcf'
// provide the testnet base url
const client = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision' })

// Get account information
client.account().then(response => client.logger.log(response.data.balances))

// Place a new order
// Place a new order

async function testOrder(symbol, quantity, side, quoteOrderQty) {

  // console.log('OLHA LÁ.....', symbol, quantity, side, quoteOrderQty)

  const data = {}

  if (side === "BUY" ){

    data.quoteOrderQty = quoteOrderQty || quantity;
  }
  else{

    data.quantity = quantity || quoteOrderQty;
  }

  // console.log('data', data);

  try {
    
    const response  = await client.newOrder(symbol, side, 'MARKET', {
      //price: '350',
      ...data
      //timeInForce: 'GTC'
    })
    console.log('SUCESSO')

    
    return response.data
  } catch (error) {

    console.log('erro' )

    client.logger.error(error.response.data.msg)
    
  }
}

module.exports = { testOrder, client }
