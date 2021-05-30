const jwt = require('jsonwebtoken');

function tokenAuth(req, res, next) {
    
    const token = req.header("authToken");

    if(!token){
        return res.status(401).send({message: "Access Denied"})
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).send({message: "Invalid Token"});
    }

}


module.exports.authorizedToken = tokenAuth;
