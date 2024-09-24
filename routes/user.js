const { Router } = require("express")
const { createUser, login, getUser, updateUser, deleteUser, protectedRoute } = require("../controller/user");
const { auth } = require("../middleware/middleware");


const userRouter = Router();

userRouter
    .post('/user', createUser)
    .get('/user', auth, getUser)
    .post('/user/login', login)
    .put('/user', auth, updateUser)
    .delete('/user', auth, deleteUser)
    .get( '/protected', auth, protectedRoute);
//userRouter.post('/user/login', login);



module.exports = {userRouter}