const { Router } = require("express")
const { likeAritcle, unlikeArticle } = require("../controller/like");
const { auth } = require("../middleware/middleware");


const likeRouter = Router();

likeRouter
    .post('/aritcle/like/:id', auth, likeAritcle)
    .post('/aritcle/unlike/:id', auth, unlikeArticle);



module.exports = {likeRouter}