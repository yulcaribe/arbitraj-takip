const axios = require("axios");

const fetchBybitPrices = async () => {
    try {
        const response = await axios.get("https://api.bybit.com/v5/market/tickers?category=spot");

        const prices = {};

        response.data.result.list.forEach((item) => {
            if (!item.symbol || !item.lastPrice) return; // Eksik veri atlanıyor

            const symbol = item.symbol.toUpperCase(); // Sembolü büyük harfe çeviriyoruz
            prices[symbol] = item.lastPrice.replace(".", ","); // Nokta yerine virgül değiştiriyoruz
        });

        return prices;

    } catch (error) {
        if (error.response) {
            // Önemli HTTP hata kodlarını logla
            const status = error.response.status;
            const importantErrors = [400, 401, 403, 404, 405, 408, 429, 500, 502, 503, 504];

            if (importantErrors.includes(status)) {
                console.error(`❌ Bybit API Hatası (${status}): ${error.response.statusText}`);
            }
        } else {
            console.error("❌ Bybit verisi çekme hatası:", error.message);
        }
        return {};
    }
};

module.exports = { fetchBybitPrices };
