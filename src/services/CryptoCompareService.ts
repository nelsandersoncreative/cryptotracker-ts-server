import axios from 'axios';
export const config = {
    headers: {
        authorization: `Apikey ${process.env.CRYPTOCOMPARE_API_KEY}`,
    }
}

export const CryptoCompareService = {
    getCoinList: async () => {
        return await axios.get('https://min-api.cryptocompare.com/data/blockchain/list', config);
    },
    getCoins: async (coins: string[]) => {
        // Get the current list of all cryptocurrencies and the following information about each coin.
        return await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins.join()}&tsyms=${coins.join()}`, config);
    },
    getCoinsWithPrices: () => {
        // Get all the current trading info (price, vol, open, high, low, etc.) of any list of cryptocurrencies in any other currency.
    },
    getHistoricalPriceData: () => {
        // 'BTC', ['USD', 'EUR'], new Date('2017-01-01')
        // Get the price of any cryptocurrency in any other currency at a given timestamp. The price comes from the daily info - so it would be the price at the end of the day GMT based on the requested timestamp.
    },
    getCoinImages: () => {
        // /media/37746251/btc.png
        // https://www.cryptocompare.com/media/37746251/btc.png
    }
};
