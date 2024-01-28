const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongodb = process.env.mongoURI;


router.get('/allchat', async(req,res)=>{
    let client;
    try{
        client = new MongoClient(mongodb);
        await client.connect();
        const db = client.db('Api-nodejs');
        const collection = db.collection('users');
        const result = await collection.find({}).toArray();
        res.json({ status: 'success', data: result });
    }
    catch(err){
        res.status(500).json({status:'error',err})

    }
    finally{
        if(client){
            client.close();
        }
    }
})




module.exports = router;