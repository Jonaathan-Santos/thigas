const { Spot } = require('@binance/connector');
//const { RestClient, AccountInfo } = require('@binance/conecctor');

// Configurar a conexão com a API da Binance
const apiKey = 'oiZGGuCWfq822ZDpGWQBxOXHIQBFgRJGuQ6zoqEWE0vWtUwW7QLHkdrcnA5qcQuP';
const apiSecret = 'siDUHi81WsTXyeFEmbBmBxt0sMSG1SPWl1a69q60AUfoh09FZwo8yoUrrn2vpEcf';
//const { SpotConnector } = require('@binance/connector');

// Configurar a conexão com a API da Binance

const connector = new Spot({
  apiKey,
  apiSecret,
  baseURL: 'https://testnet.binance.vision',
});

// Símbolos para arbitragem triangular
const symbol1 = 'BTCUSDT';
const symbol2 = 'ETHBTC';
const symbol3 = 'ETHUSDT';

// Função para obter o saldo da conta
async function getBalance(asset) {
  const response = await connector.accountAPI.getSpotAccountInfo();
  const balance = response.balances.find(item => item.asset === asset);
  return parseFloat(balance.free);
}

// Função para calcular a taxa de câmbio entre dois símbolos
async function getExchangeRate(symbol) {
  const response = await connector.marketDataAPI.getSymbolOrderBookTicker({ symbol });
  return parseFloat(response.bestBidPrice);
}

// Função principal para arbitragem triangular
async function triangularArbitrage() {
  try {
    // Obter os saldos das três moedas
    const balance1 = await getBalance('BTC');
    const balance2 = await getBalance('ETH');
    const balance3 = await getBalance('USDT');

    // Obter as taxas de câmbio entre os três pares de símbolos
    const rate1 = await getExchangeRate(symbol1);
    const rate2 = await getExchangeRate(symbol2);
    const rate3 = await getExchangeRate(symbol3);

    // Calcular a oportunidade de arbitragem triangular
    const arbitrageRatio = (balance1 / rate1) * (rate2 / rate3) * balance3;

    // Verificar se há oportunidade de arbitragem
    if (arbitrageRatio > 1) {
      console.log('Oportunidade de arbitragem triangular encontrada!');
      console.log('Lucro esperado:', arbitrageRatio - 1);
    } else {
      console.log('Não há oportunidade de arbitragem triangular no momento.');
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
}

// Executar a função de arbitragem triangular
triangularArbitrage();