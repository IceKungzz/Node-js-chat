const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'ChatOnline';

router.post('/authen', async(req,res)=>{
    try{
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,secret);
        const email = decoded.email;
        const datauser = {
            fname: decoded.fname,
            lname: decoded.lname
        }
        res.json({status:"ok",decoded,email,datauser});


    }catch(err){
        res.json({status:'error',message:'Not found token'})
    }
})


module.exports = router;