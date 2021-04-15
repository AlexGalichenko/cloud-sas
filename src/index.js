const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const { FirebaseDB } = require('./db');
const firebaseConfig = require('./credentials');
const db = new FirebaseDB(firebaseConfig);

/**
 * return free user
 */
app.get('/user', async (req, res) => {
    const user = await db.getFreeUser();
    res.status(200).json(user);
});

/**
 * return certain user
 */
app.get('/user/:id', async (req, res) => {
    const user = await db.getUser(req.params.id);
    res.status(200).json(user);
});

/**
 * todo
 * set new user
 */
app.post('/user', async (req, res) => {
    await db.createUser(req.payload);
    res.status(200);
});

/**
 * todo
 * free user
 */
app.put('/user/:id', async (req, res) => {
    const user = await db.freeUser(req.id);
    res.status(200).json(user);
});

/**
 * todo
 * delete user
 */
app.delete('/user/:id', async (req, res) => {
    const user = await db.deleteUser(req.id);
    res.status(200).json(user);
});

app.listen(PORT);
