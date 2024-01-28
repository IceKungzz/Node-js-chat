const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('./socket.io');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongodb = process.env.mongoURI;

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: '*',
        credentials: true
    }
});

app.io = io;

app.use(cors({
    origin: '*',
    credentials:true
}));

app.use(express.json());

// Import routers
const router_register = require('./router_register');
const router_login = require('./router_login');
const router_authen = require('./router_authen')
const router_apichat = require('./router_apichat')
const router_allchat = require('./router_allchat');

// Register routers
app.post('/register', router_register);
app.post('/login', router_login);
app.post('/authen', router_authen);
app.post('/chat', router_apichat);
app.get('/allchat', router_allchat);


// server.js

// ...

// ...

io.on('connection', async (socket) => {
    const userEmail = socket.handshake.query.fname;
    console.log(`${userEmail} connected`);

    const fetchDataFromMongo = async () => {
        let client;
        try {
            client = new MongoClient(mongodb);
            await client.connect();
            const db = client.db('Api-nodejs');
            const collection = db.collection('messages');
            const result = await collection.find({}).toArray();
            io.emit('allmessages', result);
            console.log(result);
        } catch (err) {
            console.error(err);
        } finally {
            if (client) {
                client.close();
            }
        }
    };

    // Fetch initial data when a new connection is established
    fetchDataFromMongo();

    socket.on('chat message', async (newmessage) => {
        try {
            client = new MongoClient(mongodb);
            await client.connect();
            const db = client.db('Api-nodejs');
            const collection = db.collection('messages');

            const result = await collection.insertOne(newmessage);
            console.log(newmessage);

            // Fetch updated data after inserting a new message
            const updatedResult = await collection.find({ _id: result.insertedId }).toArray();
            io.emit('allmessages', updatedResult);
        } catch (err) {
            console.error(err);
        } finally {
            if (client) {
                client.close();
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`${userEmail} disconnected`);
    });
});

// ...


// ...








const port = process.env.PORT || 3002;

server.listen(port, () => {
    console.log("Server running on port " + port);
});
