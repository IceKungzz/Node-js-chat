const express = require('express');
const router = express.Router();
const mongodbURI = process.env.mongoURI;
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'ChatOnline';

router.post('/login',async (req,res)=>{
    let client;
    try{
        
        client = new MongoClient(mongodbURI);
        await client.connect();
        const db = client.db('Api-nodejs');
        const collection = db.collection('users');
        const { email, password } = req.body;
        const data = await collection.findOne({email:email});
        const result_login = await bcrypt.compare(password,data.password);
        if (!data || !result_login){
            res.json({status:'error',message: 'incorrect email or password'});
            console.log('incorrect email or password');
        }else{
            const token = jwt.sign({email: data.email, fname: data.fname, lname: data.lname },secret,{expiresIn:'1h'});
            res.status(200).json({status:'ok',message: 'Login Success',token})
            console.log('login success');
        }

    }catch(err){
        res.status(500).json({status:'error',message:"Server error"+err});
    }
    finally{
        if(client){
            client.close();
        }
        
    }
})


module.exports = router;