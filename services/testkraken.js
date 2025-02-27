const { getAssetPairTicker } = require('kraken-ticker-api');

async function testKrakenAPI() {
    try {
        const ticker = await getAssetPairTicker('XBTUSDT'); // BTC/USDT Çifti
        console.log("✅ Kraken'den BTC/USDT verisi:", ticker);
    } catch (err) {
        console.error("❌ Kraken API Hatası:", err.message);
    }
}

testKrakenAPI();
