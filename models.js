const blogSchema = mongoose.Schema({
    title: String, 
    content: String,
    author: String
});

const Blog = mongoose.model("Blog", blogSchema);


