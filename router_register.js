const express = require('express');
const { MongoClient } = require('mongodb');
const mongodbURI = process.env.mongoURI;
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req,res)=>{
    let client;
    try{
        
        client = new MongoClient(mongodbURI);
        await client.connect();
        
        const db = client.db('Api-nodejs');
        const collection = db.collection('users');
        let { email, password, fname, lname } = req.body;
        
        let hash = await bcrypt.hash(password,10)
        if (!hash){
            console.log("Error hash password");
        }
        const Data = {email,password:hash, fname, lname};
        console.log(Data);
        const result = await collection.insertOne(Data);
        if (result){
            console.log("Add data Successfully");
            res.status(200).json({status:'ok',message: "Add data Successfully"});
        }
    }
    catch(err){
        console.log("Server Error");
        res.status(500).json({status:'error',message:"Server Error"});
    }
    finally{
        if(client){
            client.close();
        }
    }

})




module.exports = router;