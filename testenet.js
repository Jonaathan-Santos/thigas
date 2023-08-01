const axios = require('axios');
const crypto = require('crypto');

// Configurações da API da Binance Testnet
const apiKey = 'oiZGGuCWfq822ZDpGWQBxOXHIQBFgRJGuQ6zoqEWE0vWtUwW7QLHkdrcnA5qcQuP'
const secretKey = 'siDUHi81WsTXyeFEmbBmBxt0sMSG1SPWl1a69q60AUfoh09FZwo8yoUrrn2vpEcf'


// Função para fazer uma solicitação à API da Binance Testnet
async function makeRequest(method, endpoint, data = {}) {
  const timestamp = Date.now();
  const queryString = Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  const signature = crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');

  const response = await axios({
    method,
    url: `https://testnet.binance.vision${endpoint}?${queryString}&timestamp=${timestamp}&signature=${signature}`,
    headers: {
      'X-MBX-APIKEY': apiKey
    }
  });

  return response.data;
}

// Função para obter o saldo disponível em uma determinada moeda
async function getBalance(symbol) {
  const accountInfo = await makeRequest('GET', '/api/v3/account');
  const balance = accountInfo.balances.find(item => item.asset === symbol);
  
  return parseFloat(balance.free);
}

// Função para obter o preço atual de um determinado par de negociação
async function getPrice(symbol) {
  const ticker = await makeRequest('GET', '/api/v3/ticker/price', { symbol });
  
  return parseFloat(ticker.price);
}

// Função principal de arbitragem triangular
async function triangularArbitrage() {
  const USDTBalance = await getBalance('USDT');
  const BTCPrice = await getPrice('BTCUSDT');
  const ETHPrice = await getPrice('ETHUSDT');
  const BTCETHPrice = await getPrice('BTCETH');
  
  // Cálculo do potencial de lucro
  const profitPercentage = 2; // 2% de lucro
  const targetProfit = USDTBalance * (profitPercentage / 100);
  
  // Cálculo dos montantes de negociação
  const BTCAmount = targetProfit / BTCPrice;
  const ETHAmount = targetProfit / ETHPrice;
  const BTCEthAmount = BTCAmount / BTCETHPrice;
  
  // Execução das negociações
  const response1 = await makeRequest('POST', '/api/v3/order/test', {
    symbol: 'BTCUSDT',
    side: 'SELL',
    type: 'MARKET',
    quantity: BTCAmount.toFixed(6),
    timestamp: Date.now()
  });
  
  const response2 = await makeRequest('POST', '/api/v3/order/test', {
    symbol: 'ETHUSDT',
    side: 'SELL',
    type: 'MARKET',
    quantity: ETHAmount.toFixed(6),
    timestamp: Date.now()
  });
  
  const response3 = await makeRequest('POST', '/api/v3/order/test', {
    symbol: 'BTCETH',
    side: 'BUY',
    type: 'MARKET',
    quantity: BTCEthAmount.toFixed(6),
    timestamp: Date.now()
  });
  
  console.log('Negociações executadas com sucesso na Testnet da Binance!');
}

// Execução da função principal
triangularArbitrage().catch(err => console.error(err));
