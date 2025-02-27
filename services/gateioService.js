const axios = require("axios");

const fetchGateioPrices = async () => {
    try {
        const response = await axios.get("https://api.gateio.ws/api/v4/spot/tickers");

        const prices = {};

        response.data.forEach((item) => {
            if (!item.currency_pair || !item.last) return; // Eksik veri atlanıyor

            const symbol = item.currency_pair.replace("_", "").toUpperCase(); // "BTC_USDT" → "BTCUSDT"
            prices[symbol] = item.last.replace(".", ","); // Nokta yerine virgül değiştir
        });

        return prices;

    } catch (error) {
        if (error.response) {
            // Sadece önemli HTTP hata kodlarını logla
            if ([403, 404, 405].includes(error.response.status)) {
                console.error(`❌ Gate.io API Hatası (${error.response.status}): ${error.response.statusText}`);
            }
        } else {
            console.error("❌ Gate.io verisi çekme hatası:", error.message);
        }
        return {};
    }
};

module.exports = { fetchGateioPrices };
