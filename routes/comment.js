const { Router } = require("express")
const { likeAritcle, unlikeArticle } = require("../controller/like");
const { auth, checkCommentAuthor } = require("../middleware/middleware");
const { addComment, removeComment, updateComment, getComment } = require("../controller/comment");


const commentRouter = Router();

commentRouter
    .post('/comment/add/:id', auth, addComment)
    .put('/comment/update/:id', auth, checkCommentAuthor, updateComment)
    .delete('/comment/remove/:id', auth, checkCommentAuthor, removeComment)
    .get('/comment/get/:id', getComment);



module.exports = {commentRouter}