import jwt from 'jsonwebtoken'

const fetchUser = (req,res,next)=>{
    // Get user from jwt token and add id to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,process.env.JWT_KEY)
        req.user = data.user;
        next();
    } 
    catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
    } 
}

export {fetchUser}