const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
app.use(morgan('common'));

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {DATABASE_URL, PORT} = require('./config');

mongoose.Promise = global.Promise;

const {Blog} = require('./models');


app.get('/blogposts', (req, res) => {
    Blog.find()
    .then(posts => res.json(posts))
});

app.get('/blogposts/:id', (req, res) => {
    Blog.findById(req.params.id)
    .then(posts => res.json(posts))
})

app.post('/blogposts', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
Blog.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
})
.then(posts => res.status(201).json())
});

app.put('/blogposts/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            return res.status(400).send(message);
        }
    }
    Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    },
    {new: true}
)
    .then(posts => res.json(posts))
})

app.delete('/blogposts/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
    .then(posts => res.status(204).end())
})


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