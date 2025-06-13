import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express();
import cors from 'cors';
import mongoConnect from './utils/mongoConnect.js';
import signUpRoute from './Routes/v1/auth/signupRoute.js'
import signInRoute from './Routes/v1/auth/signinRoute.js'
const PORT = process.env.PORT || 4000;


// make my backend accessible to all domains
app.use(
    cors(
        {origin : "*" },
    )
)

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/v1/auth/',signUpRoute)
app.use('/v1/auth/',signInRoute)



async function startServer() {
    try {
        console.log("Attempting to connect to the TheadCanon wiki database")
        await mongoConnect()
        console.log("Connected to the questlog database")

        app.listen(PORT, async (error)=>{
            if (!error){
                console.log("TheadCanon is running on port",PORT)
            }
            else{
                console.log("TheadCanon has encountered an error")
            }
        } ) 
    }
    catch (error) {
        console.error("Failed to connect to the server",error)
        process.exit(1)
    }
    
}
startServer()