const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { auth } = require("./middleware/middleware");
const { userRouter } = require("./routes/user");
const { articleRouter } = require("./routes/article");
const { likeRouter } = require("./routes/like");
const { commentRouter } =  require("./routes/comment");
const { connectDB } = require("./config/connectDb");


dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const app = express();

connectDB(DB_URL);
//enable cors
app.use(cors());
app.use(express.json({ limit: '5mb', extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', userRouter);
app.use('/api/v1', articleRouter);
app.use('/api/v1', likeRouter);
app.use('/api/v1', commentRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Blog Server");
});


app.get('/middleware', auth, (req, res) => {
    res.send("User is authenticated");
});




app.listen(PORT, () => console.log(`Server started on port ${PORT}`));