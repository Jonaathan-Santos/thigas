const { Spot } = require('@binance/connector');
//const { RestClient, AccountInfo } = require('@binance/conecctor');

// Configurar a conexão com a API da Binance
const apiKey = 'oiZGGuCWfq822ZDpGWQBxOXHIQBFgRJGuQ6zoqEWE0vWtUwW7QLHkdrcnA5qcQuP';
const apiSecret = 'siDUHi81WsTXyeFEmbBmBxt0sMSG1SPWl1a69q60AUfoh09FZwo8yoUrrn2vpEcf';
//const { SpotConnector } = require('@binance/connector');

// Configurar a conexão com a API da Binance

const connector  = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision' })



// Defina os símbolos dos pares de negociação para a arbi ragem
const symbol1 = 'BTCUSDT';
const symbol2 = 'ETHBTC';
const symbol3 = 'ETHUSDT';

// Função para obter o saldo de uma determinada moeda
const getBalance = async (symbol) => {
  const accountInfo = await connector.account();
  const balance = accountInfo.data.balances.find((b) => b.asset === symbol);
  return parseFloat(balance.free);
};                                    

// Função para calcular a quantidade de moeda B que podemos comprar com uma determinada quantidade de moeda A
const calculateQuantity = (symbolA, symbolB, quantityA, depthCache) => {
  const symbolPair = symbolA + symbolB;
  const symbolPairData = depthCache[symbolPair];
  const symbolAPrice = symbolPairData.bids[0][0];
  const symbolBPrice = symbolPairData.asks[0][0];
  const symbolBQuantity = (parseFloat(quantityA) * symbolAPrice) / symbolBPrice;
  return symbolBQuantity;
};

// Função principal da arbitragem triangular
const triangularArbitrage = async () => {
  try {
    // Obter os saldos das moedas envolvidas na arbitragem
    const balanceUSDT = await getBalance('USDT');
    const balanceBTC = await getBalance('BTC');
    const balanceETH = await getBalance('ETH');

    // Obter o livro de ofertas para os pares de negociação envolvidos na arbitragem
    const depthCache = await connector.bookTicker({symbols:  [symbol1, symbol2, symbol3]});
    console.log("vai.......",depthCache)
    // Verificar se temos saldo suficiente para iniciar a arbitragem
    if (balanceUSDT > 0 && balanceBTC > 0 && balanceETH > 0) {
      // Calcular as quantidades de moedas envolvidas na arbitragem
      const quantityBTC = calculateQuantity(symbol1, symbol2, balanceUSDT, depthCache);
      const quantityETH = calculateQuantity(symbol2, symbol3, quantityBTC, depthCache);
      const quantityUSDT = calculateQuantity(symbol3, symbol1, quantityETH, depthCache);

      // Verificar se o lucro é maior que 2%
      const profitPercentage = ((quantityUSDT - balanceUSDT) / balanceUSDT) * 100;
      if (profitPercentage > 2) {
        console.log(`Arbitragem lucrativa! Lucro: ${profitPercentage.toFixed(2)}%`);

        // Coloque aqui a lógica para executar as ordens de compra e venda nas respectivas exchanges
        // Lembre-se de considerar as taxas e os limites das exchanges para evitar problemas

      } else {
        console.log(`Arbitragem não lucrativa. Lucro: ${profitPercentage.toFixed(2)}%`);
      }
    } else {
      console.log('Saldo insuficiente para iniciar a arbitragem.');
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
};

// Executar a função de arbitragem triangular
triangularArbitrage();
