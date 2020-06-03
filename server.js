const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

//connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connect to db'))

//route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))