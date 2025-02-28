const axios = require("axios");

const fetchBinancePrices = async () => {
    try {
        // Binance borsasının yalnızca spot piyasadaki coinlerini almak için API'yi çağırıyoruz
        const response = await axios.get("https://api.binance.com/api/v3/exchangeInfo");

        // Spot piyasadaki tüm işlem çiftlerini alıyoruz
        const spotPairs = response.data.symbols
            .filter(symbol => symbol.status === "TRADING" && symbol.isSpotTradingAllowed) // Spot işlemde açık olanları al
            .map(symbol => symbol.symbol);

        // Binance API'sinden fiyatları çekiyoruz
        const priceResponse = await axios.get("https://api.binance.com/api/v3/ticker/price");

        // Sadece spot piyasada olanları filtreliyoruz ve nokta yerine virgül kullanarak kaydediyoruz
        const binancePrices = priceResponse.data.reduce((acc, item) => {
            if (spotPairs.includes(item.symbol) && item.symbol.endsWith("USDT")) { // Sadece USDT paritelerini al
                acc[item.symbol.replace("USDT", "")] = item.price.toString().replace(".", ","); // Noktayı virgül ile değiştir
            }
            return acc;
        }, {});

        return binancePrices;

    } catch (error) {
        console.error("❌ Binance verisi çekme hatası:", error.message);
        return {};
    }
};

module.exports = { fetchBinancePrices };
