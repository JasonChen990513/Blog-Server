const { model } = require('mongoose');
const { Article } = require('../model/user');
const { User } = require('../model/user');
const { Comment } = require('../model/user');
const Joi = require('joi');


const addComment = async(req, res) => {
    console.log('inside add comment');
    const aritcleId = req.params.id;
    const userid = req.id;
    const content = req.body.content;
    if(!content) throw new Error('content is required');
    if(!userid) throw new Error('user id is required');

 
    const updatedArticle = await Article.findByIdAndUpdate(
        aritcleId,  // Find the article by its ID
        {
            $push: {  // Push a new comment to the comments array
                comments: {
                    user: userid,  // Set the user who made the comment
                    content: content,  // Set the content of the comment
                    date: new Date()  // Set the date of the comment
                }
            }
        },
        { new: true }  // Return the updated document after the update
    ).exec();

    if (!updatedArticle) {
        return res.status(404).json({ message: 'Article not found' });
    }
    console.log(updatedArticle);

    res.json({
        message: 'Comment added successfully',
        succeeded: true,
        data: updatedArticle
    })
}

const removeComment = async(req, res) => {
    const articleId = req.params.id;  // Get the article ID
    const commentId = req.body.commentId;  // Get the comment ID
    
    // const userid = req.id;
    // const article = await Article.findOne({_id: articleId});
    //const commentUserID = article.comments[0].user;

    // if(userid !== commentUserID.toString()) {
    //     return res.status(403).json({
    //         message: "You are not authorized to perform this action.",
    //         succeeded: false,
    //     });
    // };
    try {
        const article = await Article.findByIdAndUpdate(
            articleId,  // Find the article by ID
            {
                $pull: {
                    comments: { _id: commentId }  // Remove the comment where _id matches commentId
                }
            },
            { new: true }  // Return the updated article
        ).exec();
    
        if (!article) {
            return res.status(404).json({ message: 'Comment not found' });
        }
    
        res.status(200).json({ message: 'Comment deleted successfully', article });
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

const updateComment = async(req, res) => {
    const articleId = req.params.id;  // Get the article ID
    const commentId = req.body.commentId;  // Get the comment ID
    const content = req.body.content;  // Get the updated content


    //const article = await Article.findOne({_id: articleId});
    //const userid = req.id;
    //const commentUserID = article.comments[0].user;


    // if(userid !== commentUserID.toString()) {
    //     return res.status(403).json({
    //         message: "You are not authorized to perform this action.",
    //         succeeded: false,
    //     });
    // };

    try{
        const article = await Article.findOneAndUpdate(
            {
                _id: articleId, 
                "comments._id": commentId  // Locate the specific comment by its ID
            },
            {
                $set: {
                    "comments.$.content": content,  // Update the content field of the comment
                    "comments.$.date": new Date()   // Optionally update the comment date
                }
            },
            { new: true }  // Return the updated article
        ).exec();
    
        if (!article) {
            return res.status(404).json({ message: 'Comment not found' });
        }
    
        res.status(200).json({ message: 'Comment updated successfully', article });

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


const getComment = async(req, res) => {
    console.log('inside get comment');
    const { pageNumber, pageSize } = req.query;
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 10;
    const limit = size;
    const skip = (page - 1) * limit;


    try {
        const article = await Article.find({});
        console.log(article);   
        const totalCount = await Comment.countDocuments().exec();


        res.json({
            message: 'Article fetched successfully',
            succeeded: true,
            data: article,
            totalCount,
            pageSize: size,
            currentPage: page
        })
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

module.exports = {
    addComment,
    removeComment,
    updateComment,
    getComment
}
