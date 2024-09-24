const { Article } = require('../model/user');
const { User } = require('../model/user');
const Joi = require('joi');

const createArticleValidationSchema = Joi.object({
    title: Joi.string().required('title is required'),
    content: Joi.string().required('content is required')
})

const createArticle = async(req, res) => {
    console.log('inside the creacte article');
    try {
        const {title, content} = req.body;
        const author = req.id;
        const {error} = await createArticleValidationSchema.validate({title, content});
        if(error) throw new Error(error.details[0].message);


        const article = new Article({
            title,
            content,
            author
        })  

        await article.save();
        res.json({
            message: 'Article created successfully',
            succeeded: true,
            date: article        
        })
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

const deleteArticle = async(req, res) => {  
    try {
        const id = req.params.id;
        const article = await Article.findByIdAndDelete(id);
        res.json({
            message: 'Article deleted successfully',
            succeeded: true,
            date: article
        })
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

const getArticle = async(req, res) => {
    try {
        const articles = await Article.find();
        res.json({
            message: 'Article fetched successfully',
            succeeded: true,
            data: articles
        })
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

const updateArticle = async(req, res) => {
    try{

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


const getArticleById = async(req, res) => {
    try{
        const id = req.params.id;
        console.log(req.params)
        console.log(id)
        if(!id) throw new Error('id is required');
        const article = await Article.findOne({_id: id});
        if(!article) throw new Error('Article not found');
        res.json({
            message: 'Article fetched successfully',
            succeeded: true,
            data: article
        })
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

module.exports = {createArticle, deleteArticle, getArticle, updateArticle, getArticleById}






