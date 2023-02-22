const  express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB");
mongoose.set('strictQuery',true);

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,articlesFound){
        if(!err)
            res.send(articlesFound);
    });
})

.post(function(req,res){
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save(function(err){
        if(!err)
            res.send("Added a new article");
        else
            res.send(err);
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
            res.send("successfully deleted all articles");
        else
            res.send(err);
    });
});







app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(!err)
            res.send(foundArticle);
        else
            res.send("No articles matching found");
    });
})
.put(function(req,res){
    Article.updateOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content},function(err){
        if(!err)
            res.send("Successfully updated article");
    });
})
.patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle},{$set: req.body},function(err){
        if(!err)
            res.send("Successfully updated article");
    });
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
        if(!err)
            res.send("Successfully deleted the mentioned article");
    });
});

app.listen(3000, function(){
    console.log("Server has started on port 3000.");
});