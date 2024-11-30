// checks if the refresh token sent is blacklisted
const TokenBlacklist = require("../models/tokenBlacklist")


exports.checkIfBlacklist = async (req, res, next)=>{
    const token = req.headers['authorization']?.split(" ")[1]

    if (!token){
        console.log("no token G")
        res.status(401).json()
          
    }else{
        // check if token is blacklisted
        const blackListedToken = await TokenBlacklist.findOne({token})
        if(blackListedToken){
            console.log("blacklisted token man")
            res.status(401).json()
           
        }else{
            next()
        }
    }
}

