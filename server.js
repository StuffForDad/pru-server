// server.js
const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch
const app = express();
const PORT = process.env.PORT || 10000;

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/data", async (req, res) => {
  try {
    // Fetch PRU.AX price from Yahoo Finance
    const yfRes = await fetch(
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=PRU.AX"
    );
    const yfData = await yfRes.json();
    const price = yfData.quoteResponse.result[0].regularMarketPrice;

    // Fetch AUD->GBP exchange rate
    const exRes = await fetch("https://api.exchangerate.host/latest?base=AUD&symbols=GBP");
    const exData = await exRes.json();
    const rate = exData.rates.GBP;

    res.json({ price, rate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
