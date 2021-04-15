const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 8080;
const { FirebaseDB } = require('./db');
const firebaseConfig = require('./credentials');
const db = new FirebaseDB(firebaseConfig);

app.use(bodyParser.json())

/**
 * return free user
 */
app.get('/user', async (req, res) => {
    const user = await db.getFreeUser();
    if (user) {
        res.status(200).json(user);
    } else {
        res.sendStatus(404);
    }
});

/**
 * return certain user
 */
app.get('/user/:id', async (req, res) => {
    const user = await db.getUser(req.params.id);
    res.status(200).json(user);
});

/**
 * set new user
 */
app.post('/user', async (req, res) => {
    await db.addUser(req.body);
    res.sendStatus(201);
});

/**
 * free user
 */
app.put('/user/:id', async (req, res) => {
    const user = await db.freeUser(req.params.id);
    res.status(200).json(user);
});

/**
 * delete user
 */
app.delete('/user/:id', async (req, res) => {
    const user = await db.deleteUser(req.params.id);
    res.status(204).json(user);
});

/**
 * delete all users
 */
app.delete('/user', async (req, res) => {
    const user = await db.deleteUsers();
    res.status(204).json(user);
});

app.listen(PORT);
