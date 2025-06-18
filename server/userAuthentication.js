const jwt = require('jsonwebtoken')

function userAuthentication(req,res,next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({message:'invalid'});
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({message:'user not found'});
        req.user = user;
        next()
    })
}

module.exports = userAuthentication;