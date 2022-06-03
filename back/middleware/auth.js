const jwt = require('jsonwebtoken')


const auth = (req, res, next)=>{
    try {
        const token = req.header("x-auth-token")
        // console.log("sasa",token)
        if(!token){
            return res.status(401).json({
                msg:"no token"
            })
        }
        const verify = jwt.verify(token,process.env.SEC_KEY)
        console.log("vvv",verify)
        if(!verify){
            return res.status(400).json({
                msg:"verification failed" 
            })
        }
        // console.log(verify)
        req.user = verify.id;
        next()

    } catch (error) {
        return res.status(400).json({
            msg:error
        })
    }
}

module.exports = auth