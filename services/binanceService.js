const axios = require("axios");

const fetchBinancePrices = async () => {
    try {
        const response = await axios.get("https://api.binance.com/api/v3/ticker/price");

        return response.data.reduce((acc, item) => {
            // Nokta yerine virgül kullanarak fiyatı formatla
            acc[item.symbol] = item.price.replace(".", ",");
            return acc;
        }, {});

    } catch (error) {
        console.error("❌ Binance verisi çekme hatası:", error.message);
        return {};
    }
};

module.exports = { fetchBinancePrices };
