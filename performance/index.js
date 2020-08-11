process.env.UV_THREADPOOL_SIZE = 1;

const crypto = require('crypto');
const express = require('express');
const app = express();
const Worker = require('webworker-threads').Worker;
// const worker = require('worker_threads');

app.get('/', (_req, res) => {
  // crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  //   res.send('Hi there');
  // });
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
      postMessage(counter);
    };
  });

  worker.onmessage = function (message) {
    console.log(message.data);
    res.send('' + message.data);
  };

  worker.postMessage();
});

app.get('/fast', (req, res) => res.send('This was fast!'));

app.listen(3000);
