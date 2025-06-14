import jwt from "jsonwebtoken"

const Authorization = async(req,res,next)=>{
    const authHeader = req.headers.authorization

    // check if authorization header is included in the API call
    if (!authHeader){
        console.log("WARN","\n source:logs/auth/authorization.js  ",`Authorization header not found,request to ${req.originalUrl} is not authorized`)
        return res.status(401).json({message:"Authorization header not found, User is not authorized",success:false})
    }
    
    // check if authoriation header starts with bearer (if its a bearer token)
    if (!authHeader.startsWith("Bearer ")){
        console.log("WARN","\n source: logs/auth/authorization.js",`Authorization format to ${req.originalUrl} is not valid`)
        return res.status(401).json({message:"Authorization format is invalid",success:false})
    }
    // extract the token from the header
    const token = authHeader.split(" ")[1]
    try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decoded.user
            console.log("level:INFO", "\n source: routes/auth/authorization.js", `User ${req.user.id} authenticated for request to ${req.originalUrl}`);
            next()
        }
    catch(error)
    {
        if (error.name === "TokenExpiredError"){
            console.log("WARN", "\n source: logs/auth/authorization.js", `Access token expired for request to ${req.originalUrl} by user (if known from token before expiry). Client should refresh.`)
            return res.status(401).json({message:`Access token expired, please refresh`,error: "TokenExpiredError", code: "TOKEN_EXPIRED",success:false})
        }
        else{
            console.log("WARN", "\n source: routes/auth/authorization.js", `Invalid token for request to ${req.originalUrl}: ${error.message}`);
            return res.status(401).json({message:`Error during authorization: ${error.message}`,error:error.name})
        }
    }

}

export default Authorization



