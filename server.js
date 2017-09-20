const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
app.use(morgan('common'));

const {DATABASE_URL, PORT} = require('./config');

mongoose.Promise = global.Promise;

const blogPostsRouter = require ('./blogPostsRouter')
app.use('/blogposts', blogPostsRouter);



// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


// `closeServer` function is here in original code

if (require.main === module) {
  runServer().catch(err => console.error(err));
};