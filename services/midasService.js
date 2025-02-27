const puppeteer = require("puppeteer");

const MIDAS_URL = "https://www.getmidas.com/canli-kripto/";

const fetchMidasPrices = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );
        await page.goto(MIDAS_URL, { waitUntil: "networkidle2" });

        const results = await page.evaluate(() => {
            let data = [];
            document.querySelectorAll(".table tbody tr").forEach((row) => {
                let coin = row.querySelector("td:nth-child(1)")?.innerText.trim();
                let priceText = row.querySelector("td:nth-child(2)")?.innerText.trim();
                
                // Burada, fiyatın noktalarından sadece birini kaldırıyoruz
                let price = priceText.replace("$", "").replace(".", "").trim(); // Dolar işareti ve nokta siliniyor

                // Coin isminin başındaki sembolleri siliyoruz (Örneğin: 'BTCUSDT' → 'BTC')
                let symbol = coin.split(" ")[0].toUpperCase();

                if (symbol && price) {
                    data.push({ name: "Midas", coin: symbol, price });
                }
            });
            return data;
        });

        await browser.close();
        return results;  // Fiyatları olduğu gibi döndürüyoruz
    } catch (error) {
        console.error("❌ Midas verisi çekme hatası:", error.message);
        return [];
    }
};

module.exports = { fetchMidasPrices };
