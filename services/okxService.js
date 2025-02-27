const axios = require("axios");

const fetchOKXPrices = async () => {
    try {
        const response = await axios.get("https://www.okx.com/api/v5/market/tickers?instType=SPOT");

        const prices = {};

        response.data.data.forEach((item) => {
            if (!item.instId || !item.last) return; // Eksik veri atlanıyor

            const symbol = item.instId.replace("-", "").toUpperCase(); // "BTC-USDT" → "BTCUSDT"
            prices[symbol] = item.last.replace(".", ","); // Nokta yerine virgül değiştir
        });

        return prices;

    } catch (error) {
        if (error.response) {
            // Önemli HTTP hata kodlarını logla
            const status = error.response.status;
            const importantErrors = [400, 401, 403, 404, 405, 408, 429, 500, 502, 503, 504];

            if (importantErrors.includes(status)) {
                console.error(`❌ OKX API Hatası (${status}): ${error.response.statusText}`);
            }
        } else {
            console.error("❌ OKX verisi çekme hatası:", error.message);
        }
        return {};
    }
};

module.exports = { fetchOKXPrices };
