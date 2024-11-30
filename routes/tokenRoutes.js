const express = require("express");
const router = express.Router()
const jwt = require("jsonwebtoken")
const TokenBlacklist = require("../models/tokenBlacklist")



// route to get the tokens
router.post("/refresh", async (req, res)=>{
    // check if the req has the previous tokens
    try{
        const refreshToken = req.headers["authorization"]?.split(" ")[1]
        if(!refreshToken) return res.status(400)
        const verifyRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET)
        const newAccessToken = jwt.sign({userId:verifyRefreshToken.userId}, process.env.JWT_SECRET, {expiresIn:"1h"})
        const newRefreshToken = jwt.sign({userId:verifyRefreshToken.userId}, process.env.JWT_SECRET, {expiresIn:"1d"})
        const blacklistedToken =  new TokenBlacklist({token:refreshToken})
        await blacklistedToken.save()
        res.status(200).json({accessToken:newAccessToken, refreshToken:newRefreshToken})


    }catch (e){
        console.log("error: ", e)
        res.status(401).json()
    } 
    
})

module.exports = router