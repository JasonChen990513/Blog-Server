const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../model/user');
const jwtSecret = process.env.JWT_SECRET
const env = require('dotenv');
env.config();
const vaildationSchena = Joi.object({
   password: Joi.string().required('password is required').alphanum('characters must be alphanumeric'),
   email: Joi.string().email().required('email is required'),
})


const updateValidationSchena = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    bio: Joi.string(),
 })


const createUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        const { error } = await vaildationSchena.validateAsync({email, password});

        if(error){
            const message = error.details[0].message;
            const err = new Error(message);
            err.statusCode = 400;
            throw err 
        }

        let user = await User.findOne({email});

        if(user) throw new Error('User already exists');

        const salt = 10;
        const getSalt = await bcrypt.genSalt(salt);
        const hashedPassword = await bcrypt.hash(password, getSalt);

        user = new User({email, password});
        user.password = hashedPassword;
        await user.save();

        res.json({
            message: 'User created successfully',
            succeeded: true,
            date: user
        });
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

const login = async(req, res) => {

    try {
        const {email, password} = req.body;

        const { error } = await vaildationSchena.validateAsync({email, password});

        if(error){
            const message = error.details[0].message;
            const err = new Error(message);
            err.statusCode = 400;
            throw err 
        }

        let user = await User.findOne({email});
        if(!user) throw new Error('Incorrect email or password');

        // const isMatch = await bcrypt.compare(password, user.password);
        // if(!isMatch) throw new Error('Incorrect email or password');

        const hashedPassword = user.password;

        const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
        if(!isCorrectPassword) throw new Error('Incorrect email or password');

        const token = await jwt.sign(
            {
                email: user.email,
                id: user?._id
            },
            jwtSecret,
        );

        // Set the token in an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true,  // Can't be accessed by JavaScript
            secure: true,    // Send only over HTTPS (important for production)
            sameSite: 'Strict', // Helps with CSRF protection
            maxAge: 3600000   // 1 hour in milliseconds
        });

        res.status(200).json({
            message: 'User logged in successfully',
            succeeded: true,
            data: {
                email: user.email,
                token: token,
            }
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

// Protected route example
const protectedRoute = (req, res) => {
    console.log(0)
    console.log(req.headers.cookie)
    const tokensplit = req.headers.cookie.split('=');
    const token = tokensplit[1];
    console.log(token)
    console.log(1)
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
        console.log(2)
      //const decoded = jwt.verify(token, 'FlO9yja5F9IuoY0otX0v4pax+zE=');
      //console.log(decoded)
      return res.json({ message: 'Welcome to the protected route' });
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const getUser = async(req, res) => {
    try {
        console.log('inside the get user');
        const id = req.id;
        console.log(id)
        console.log('wait for search')
        const user = await User.findOne({_id: id}).select(['email','bio','_id','createdAt', 'updatedAt']).exec();

        if(!user) throw new Error('User not found');
        console.log('user found')
        res.status(200).json({
            message: 'Get User successful',
            succeeded : true,
            data: user  
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


const updateUser = async(req, res) => {
    try {
        const {firstname, lastname, bio} = req.body;
        console.log(firstname, lastname)
        const id = req.id;

        const userToUpdate = {

        };

        if(firstname) userToUpdate.firstName = firstname;
        if(lastname) userToUpdate.lastName = lastname;
        if(bio) userToUpdate.bio = bio;

        console.log(userToUpdate)
        console.log(0)
        const { error } = await updateValidationSchena.validateAsync(userToUpdate);
        console.log(1)
        if(error){
            const message = error.details[0].message;
            const err = new Error(message);
            err.statusCode = 400;
            throw err 
        }
        console.log(2)
        const user = await User.findOneAndUpdate({_id: id}, userToUpdate, {new: true});
        console.log(3)
        if(!user) throw new Error('User not found');


        user.password = undefined;

        res.status(200).json({
            message: 'User updated successfully',
            succeeded : true,
            data: user  
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


const deleteUser = async(req, res) => {
    try {
        const id = req.id;
        const user = await User.findOneAndDelete({_id: id});    
        if(!user) throw new Error('User not found');
        res.status(200).json({
            message: 'User deleted successfully',
            succeeded : true,
            data: null
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

module.exports = {createUser, login, getUser, updateUser, deleteUser, protectedRoute}