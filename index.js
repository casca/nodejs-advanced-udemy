const express = require('express');
const app = express();

function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}

app.get('/', (_req, res) => {
  doWork(5000);
  res.send('Hi there');
});

app.listen(3000);