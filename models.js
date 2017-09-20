const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: String, 
    content: String,
    author: {firstName: String, lastName: String},
    created: {type: Date, default: Date.now}
});

blogSchema.virtual('fullName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
})

blogSchema.methods.apiRepr = function() { 
    return {
        id: this._id,
        author: this.fullName,
        content: this.content,
        title: this.title,
        created: this.created
    }
}

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {Blog};