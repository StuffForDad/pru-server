// server.js
const express = require('express');
const fetch = require('node-fetch'); // if Node >=18, you can use global fetch
const app = express();
const port = process.env.PORT || 3000;

// === Replace with your real API keys ===
const TWELVEDATA_API_KEY = "8e0b84d987334ac89d90957f34e712b4";

// Helper function to fetch PRU.AUX price from Twelve Data
async function getSharePrice() {
  try {
    const url = `https://api.twelvedata.com/price?symbol=PRU.AUX&apikey=${TWELVEDATA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.price) throw new Error("No price returned from API");
    return parseFloat(data.price);
  } catch (err) {
    console.error("Error fetching share price:", err.message);
    return null;
  }
}

// Helper function to fetch AUD→GBP exchange rate from Twelve Data
async function getExchangeRate() {
  try {
    const url = `https://api.twelvedata.com/price?symbol=AUD/GBP&apikey=${TWELVEDATA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.price) throw new Error("No exchange rate returned");
    return parseFloat(data.price);
  } catch (err) {
    console.error("Error fetching exchange rate:", err.message);
    return null;
  }
}

// /data endpoint
app.get('/data', async (req, res) => {
  try {
    const sharePrice = await getSharePrice();
    const exchangeRate = await getExchangeRate();

    if (sharePrice === null || exchangeRate === null) {
      return res.status(500).json({ error: "Failed to fetch live data" });
    }

    // Enable CORS so local HTML can fetch
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json({
      sharePrice,
      exchangeRate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
