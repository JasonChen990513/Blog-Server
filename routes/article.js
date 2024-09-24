const { Router } = require("express")
const { createArticle, updateArticle, getArticle, getArticleById, deleteArticle } = require("../controller/article");
const { auth } = require("../middleware/middleware");


const articleRouter = Router();

articleRouter
    .post('/aritcle', auth, createArticle)
    .get('/aritcle', getArticle)
    .put('/aritcle', updateArticle)
    .delete('/aritcle', deleteArticle)
    .get('/article/:id', getArticleById);



module.exports = {articleRouter}