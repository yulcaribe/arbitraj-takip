const express = require("express");
const cors = require("cors");

// Borsa servisleri (Midas, Binance, KuCoin, Bybit, OKX, Gate.io)
const { fetchMidasPrices } = require("./services/midasService");
const { fetchBinancePrices } = require("./services/binanceService");
const { fetchKuCoinPrices } = require("./services/kuCoinService");
const { fetchBybitPrices } = require("./services/bybitService");
const { fetchOKXPrices } = require("./services/okxService");
const { fetchGateioPrices } = require("./services/gateioService");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = 3001;

app.get("/prices", async (req, res) => {
    try {
        // Borsalardan fiyatları paralel olarak alıyoruz
        const [midasPrices, binancePrices, kuCoinPrices, bybitPrices, okxPrices, gateioPrices] = await Promise.all([
            fetchMidasPrices(),
            fetchBinancePrices(),
            fetchKuCoinPrices(),
            fetchBybitPrices(),
            fetchOKXPrices(),
            fetchGateioPrices()
        ]);

        // Tüm sonuçları işleyelim
        let allResults = midasPrices.map(entry => {
            let binanceSymbol = `${entry.coin}USDT`;
            let gateioSymbol = `${entry.coin}USDT`;
            let okxSymbol = `${entry.coin}USDT`;
            let bybitSymbol = `${entry.coin}USDT`;
            let kucoinSymbol = `${entry.coin}USDT`;

            return {
                coin: entry.coin,
                Midas: entry.price,
                Binance: binancePrices[binanceSymbol] || "Veri yok",
                KuCoin: kuCoinPrices[kucoinSymbol] || "Veri yok",
                Bybit: bybitPrices[bybitSymbol] || "Veri yok",
                OKX: okxPrices[okxSymbol] || "Veri yok",
                Gateio: gateioPrices[gateioSymbol] || "Veri yok"
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
