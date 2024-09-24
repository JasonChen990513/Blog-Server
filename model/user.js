const { date } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },

        firstName: {
            type: String,
            trim: true,
            default: ""
        },

        lastName: {
            type: String,
            trim: true,
            default: ""
        },

        password: {
            type: String,
            required: true
        },

        bio: {
            type: String,
            trim: true,
            default: null
        },
    },
    {
        timestamps: true
    }
)



const articaleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }]
    },
    {
        timestamps: true
    }
)


const likeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    article: {
        type: mongoose.Schema.ObjectId,
        ref: 'Article',
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
    },
    {
        timestamps: true
    }
);

const Like = mongoose.model('Like', likeSchema);
const Article = mongoose.model('Article', articaleSchema);
const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = { User, Article, Like, Comment };








