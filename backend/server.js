const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let windowPrevState = [];
let windowCurrState = [];


const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`http://20.244.56.144/evaluation-service/${type}`);
    return response.data.numbers || [];
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    return [];
  }
};


app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;
  const queryNums = req.query.nums;
  const validTypes = ['primes', 'fibo', 'even', 'rand'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Use primes, fibo, even, or rand.' });
  }

  let numbers = [];

 
  if (queryNums) {
    numbers = queryNums.split(',').map(Number).filter(n => !isNaN(n));
  } else {
    
    numbers = await fetchNumbers(type);
  }


  windowPrevState = [...windowCurrState];
  const uniqueNewNumbers = numbers.filter(num => !windowCurrState.includes(num));
  windowCurrState = [...windowCurrState, ...uniqueNewNumbers].slice(-WINDOW_SIZE);

  const avg = windowCurrState.reduce((sum, val) => sum + val, 0) / windowCurrState.length || 0;

  res.json({
    windowPrevState,
    windowCurrState,
    numbers,
    avg: parseFloat(avg.toFixed(2))
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
