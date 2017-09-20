const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
app.use(morgan('common'));

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const {Blog} = require('./models');

router.get('/', (req, res) => {
    Blog.find()
    .then(posts => {res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
        res.status(500).json({message: 'Internal server error'});
    })
});

router.get('/:id', (req, res) => {
    let money;
    Blog.findById(req.params.id)
    .then(post => res.json(post.apiRepr()))
    .catch(err => {
        res.status(500).json({message: 'Internal server error', err: err.message})
    })
});

router.post('/', jsonParser, (req, res) => {
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
.then(posts => res.status(201).json(posts.apiRepr()))
.catch(err => {
    res.status(500).json({message: 'Internal server error'});
})
});

router.put('/:id', jsonParser, (req, res) => {
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
    .catch(err => {
        res.status(500).json({message: 'Internal server error'});
    })
})

router.delete('/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
    .then(posts => res.status(204).end())
})

module.exports = router;