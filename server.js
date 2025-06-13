const express = require("express");
const cors = require("cors");

// Borsa servisleri (Midas, Binance, KuCoin, Bybit, OKX, Gate.io)
const { fetchBinancePrices } = require("./services/binanceService");
const { fetchKuCoinPrices } = require("./services/kuCoinService");
const { fetchBybitPrices } = require("./services/bybitService");
const { fetchOKXPrices } = require("./services/okxService");
const { fetchGateioPrices } = require("./services/gateioService");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = 3000;

app.get("/prices", async (req, res) => {
    try {
        // Binance'tan fiyatları alıyoruz
        const binancePrices = await fetchBinancePrices();
        
        // Diğer borsalardan fiyatları paralel olarak alıyoruz
        const [kuCoinPrices, bybitPrices, okxPrices, gateioPrices] = await Promise.all([
            fetchKuCoinPrices(),
            fetchBybitPrices(),
            fetchOKXPrices(),
            fetchGateioPrices()
        ]);

        // Binance coin'leri ile tüm verileri birleştiriyoruz
        let allResults = Object.keys(binancePrices).map(coin => {
            // Diğer borsalardan fiyatları alıyoruz
            const kucoinPrice = kuCoinPrices[`${coin}USDT`] || "Veri yok";
            const bybitPrice = bybitPrices[`${coin}USDT`] || "Veri yok";
            const okxPrice = okxPrices[`${coin}USDT`] || "Veri yok";
            const gateioPrice = gateioPrices[`${coin}USDT`] || "Veri yok";

            return {
                coin: coin,
                Binance: binancePrices[coin] || "Veri yok",
                KuCoin: kucoinPrice,
                Bybit: bybitPrice,
                OKX: okxPrice,
                Gateio: gateioPrice
            };
        });

        res.json({ exchanges: allResults });

    } catch (error) {
        console.error("❌ Sunucu hatası: Borsa verileri çekilemedi.");
        res.status(500).json({ error: "Sunucu hatası: Veriler çekilemedi. Lütfen daha sonra tekrar deneyin." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Arbitraj takip sunucusu ${PORT} portunda çalışıyor.`);
});
