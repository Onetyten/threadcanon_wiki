import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express();
import cors from 'cors';
import signUpRoute from './Routes/v1/auth/signupRoute.js'
import signInRoute from './Routes/v1/auth/signinRoute.js'
import refreshAccessTokenRoute from './Routes/v1/auth/refreshAcessToken.js'
import createBlogRoute from './Routes/v1/api/createBlogRoute.js'
const PORT = process.env.PORT || 4000;
import Authorization from './middlewares/authorization.js';


// make my backend accessible to all domains
app.use(
    cors(
        {origin : "*" },
    )
)

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//Authentication routes
app.use('/v1/auth/',signUpRoute)
app.use('/v1/auth/',signInRoute)
app.use('/v1/auth/',refreshAccessTokenRoute)


// any route that comes after this will be checked for a token so dont put any non login required app after this for God's sake
app.use('/v1/api',Authorization)
app.use('/v1/api/blog/',createBlogRoute)




export {app}