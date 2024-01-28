const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongodb = process.env.mongoURI;
const io = require('socket.io'); // Import io instance

router.post('/chat', async (req, res) => {
    let client;
    try {
        client = new MongoClient(mongodb);
        await client.connect();
        
        const db = client.db('Api-nodejs');
        const collection = db.collection('chat-messages');

        // io socket
        io.on('connection', async (socket) => {
            console.log('user connected');

            socket.on('chat message', async (message) => {
                const datamessage = {
                    fname: socket.fname,
                    message: message,
                    time: socket.time
                }
                const result = await collection.insertOne(datamessage);
                console.log('Message = ', result);
                io.emit('chat message', message);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            })
        });
    } catch (err) {
        res.status(500).json({ status: "error", err })
    } finally {
        if (client) {
            client.close();
        }
    }
});

module.exports = router;
