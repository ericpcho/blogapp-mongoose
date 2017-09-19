const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
app.use(morgan('common'));

const {DATABASE_URL} = require('./config');
mongoose.connect(DATABASE_URL);

mongoose.Promise = global.Promise;




app.get('bl')

app.post('/blogposts'), (req, res) => {
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
.then(Blog => res.status(201)).json()
}


