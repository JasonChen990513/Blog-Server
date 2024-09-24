const { Article } = require('../model/user');
const { Like } = require('../model/user');
const Joi = require('joi');

const createLikeValidationSchema = Joi.object({
    userId: Joi.string().required('userId is required'),
    articleId: Joi.string().required('articleId is required')
})

const likeAritcle = async(req, res) => {
    try{
        console.log('inside likeAritcle')
        // this is article id
        const articleId = req.params.id;
        const userId = req.id
        // console.log(articleId)
        // if(!articleId) throw new Error('id is required');
        const article = await Article.findOne({_id: articleId});
        // if(!article) throw new Error('Article not found');

        const {error} = await createLikeValidationSchema.validate({userId, articleId});
        if(error) throw new Error(error.details[0].message);

        const like = await Like.findOne({ userId, articleId});

        if (!like) {
            console.log("User hasn't liked this post yet");
            await Like.create({ userId, articleId});  // Create a new like entry
            console.log("User liked this post");
            article.likes += 1;
            await article.save();

            res.json({
                message: 'Article fetched successfully',
                succeeded: true,
                data: article
            })
        } else {
            res.json({
                message: "User already liked this post"
            })
        }



    } catch (error) {
        const message = error?.message;
        const statusCode = error?.statusCode;        
        res.status(statusCode ?? 400).json({
            message,
            succeeded: false,
            data: null
        })
    }
}

const unlikeArticle = async(req, res) => {
    try{
        const articleId = req.params.id;
        const userId = req.id
        // console.log(req.params)
        // console.log(articleId)
        // if(!articleId) throw new Error('id is required');
        // const article = await Article.findOne({_id: articleId});
        // if(!article) throw new Error('Article not found');
        const {error} = await createLikeValidationSchema.validate({userId, articleId});
        if(error) throw new Error(error.details[0].message);


        const like = await Like.findOneAndDelete({ userId, articleId });

        if (like) {
            const article = await Article.findById(articleId);
            article.likes -= 1;
            await article.save();

            const updatedArticle = await Article.findById(articleId);
            res.json({
                message: 'Article fetched successfully',
                succeeded: true,
                data: updatedArticle
            })
        } else {
            res.json({
                message: "User hasn't liked this post yet"
            })
            
        }

    } catch (error) {
        const message = error?.message;
        const statusCode = error?.statusCode;        
        res.status(statusCode ?? 400).json({
            message,
            succeeded: false,
            data: null
        })
    }
}

module.exports = {likeAritcle, unlikeArticle}










