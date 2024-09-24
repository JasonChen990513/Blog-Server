const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();
const test = "FlO9yja5F9IuoY0otX0v4pax+zE=";
const { Article } = require('../model/user');

const auth = (req, res, next) => {

    try {
        const cookieToken = req.headers.cookie.split('=');
        const cookieTokensplit = cookieToken[1];
        const token = req.headers['authorization'];
        console.log('this is token');
        console.log(token);
        const splitToken = token.split(' ');
        const bearer = splitToken?.[0];
        if(bearer !== 'Bearer') {
            const message = new Error('authorised user');
            err.statusCode = 400;
            throw message;
        }

        const jwtToken = splitToken?.[1];
        const result = jwt.verify(cookieTokensplit,test);
        //const result = jwt.verify(jwtToken, jwtSecret);
        console.log('this is result')
        console.log(result);
        const userId = result?.id;
        console.log(userId)

        req.id = userId;

        //res.write(JSON.stringify(result));
        next();
    } catch (error) {
        const message = error?.message;
		const statusCode = error?.statusCode;
		res.status(statusCode ?? 400).json({
			message,
			succeeded: false,
			data: null,
		});
    }


}

//check the user is the comment author
const checkCommentAuthor = async(req, res, next) => {
    try {
        console.log('inside checkCommentAuthor-----------------------------------');
        const commentId = req.body.commentId;
        const articleId = req.params.id;
        const userId = req.id;

        // Find the article by its ID and project only the comments array
        const article = await Article.findById(articleId, 'comments');
        console.log(article);
        if (!article) throw new Error('Article not found');

        // Find the specific comment by commentId inside the comments array
        const comment = article.comments.id(commentId); 
        console.log((comment.user).toString());
        console.log(userId);

        if( (comment.user).toString() !== userId){
            console.log('id not match');
            res.json({
                message: "id not match to author",
                succeeded: false,
                data: null
            })
            
        } else {
            console.log('finish checkCommentAuthor-----------------------------------');
            next(); 
        }

        

    } catch (error) {
        const message = error?.message;
		const statusCode = error?.statusCode;
		res.status(statusCode ?? 400).json({
			message,
			succeeded: false,
			data: null,
		});
    }
}


module.exports = {auth, checkCommentAuthor};