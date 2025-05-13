const axios = require("axios");

const fetchKuCoinPrices = async () => {
    try {
        const response = await axios.get("https://api.kucoin.com/api/v1/market/allTickers");

        const prices = {};

        response.data.data.ticker.forEach((item) => {
            if (!item.symbol || !item.last) return; // Eksik veri atlanıyor

            const symbol = item.symbol.replace("-", "").toUpperCase(); // "BTC-USDT" → "BTCUSDT"
            prices[symbol] = item.last.replace(".", ","); // Nokta yerine virgül değiştiriyoruz
        });

        return prices;

    } catch (error) {
        if (error.response) {
            // Önemli HTTP hata kodlarını logla
            const status = error.response.status;
            const importantErrors = [400, 401, 403, 404, 405, 408, 429, 500, 502, 503, 504];

            if (importantErrors.includes(status)) {
                console.error(`❌ KuCoin API Hatası (${status}): ${error.response.statusText}`);
            }
        } else {
            console.error("❌ KuCoin verisi çekme hatası:", error.message);
        }
        return {};
    }
};

module.exports = { fetchKuCoinPrices };
