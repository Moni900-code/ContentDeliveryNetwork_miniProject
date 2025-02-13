const express = require('express');
const NodeCache = require('node-cache');
const axios = require('axios');
const app = express();
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
const PORT = 4000;
const PRIMARY_SERVER = 'http://localhost:5000';

// Handle Static Requests with Cache Logic
app.get('/static/*', async (req, res) => {
  const cacheKey = req.url;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(`[CACHE HIT] URL: ${cacheKey}`);
    res.send(cachedData);
  } else {
    console.log(`[CACHE MISS] URL: ${cacheKey}`);
    try {
      const response = await axios.get(`${PRIMARY_SERVER}${req.url}`);
      if (response.status === 200) {
        cache.set(cacheKey, response.data);
        console.log(`[FETCH] Data fetched from Primary Server and cached: ${cacheKey}`);
        res.send(response.data);
      } else {
        console.error(`[ERROR] Primary Server response error: ${response.status}`);
        res.status(response.status).send('Primary server error');
      }
    } catch (error) {
      console.error(`[FETCH FAILED] Unable to fetch from Primary Server: ${error.message}`);
      res.status(500).send('Error fetching from Primary Server');
    }
  }
});

// Start Edge Server
app.listen(PORT, () => console.log(`Edge Server running on port ${PORT}`));