const jwt = require('jsonwebtoken');

const middleWare = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if(!token) 
        return res.status(401).json( { message : "you are not authenticated"})
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()

    }
    catch(err){
        return res.status(403).json({ message : "token is not valid"})
    }

}
module.exports = {middleWare}