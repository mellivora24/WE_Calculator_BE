"use strict";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

var PORT = process.env.PORT || 5000;
var Home = require('./model/cfg_data');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoose.set('strictQuery', true);

var connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:4qS6oQBwk9eoCQNO@admin.d1eqyk8.mongodb.net/?retryWrites=true&w=majority');
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

app.get('/', (req, res) => {
  res.send('<h1>Server is running...check with Postman!<h1>');
});

app.get('/home', async (req, res) => {
    try {
        const data = await Home.find();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

app.get('/name', async (req, res) => {
    try {
        const listName = [];
        const data = await Home.find();
        data.forEach((x) => {
            listName.push(x.name);
        });
        res.json(listName);
    } catch (error) {
        res.json(error);
    }
});

app.post('/home', async (req, res) => {
    try {
        const { name, phone, email, used } = req.body;
        const data = new Home({ name, phone, email, used });
        await data.save();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

app.post('/add/:id', async (rep, res) => {
    try {
        const { electric, water, ePrice, wPrice } = req.body;
        const data = new Home({ electric, water, ePrice, wPrice });
        await data.collection.updateOne({ id: id },
            {
                $push: {
                    "electric": electric,
                    "water": water,
                    "ePrice": ePrice,
                    "wPrice": wPrice
                }
            })
        res.json(data);
    } catch (error) {
        res.json(error);
    }
})

app.put('/home/:id', async (req, res) => {
    try {
        await Home.updateOne({ _id: req.params.id }, req.body);
        res.json(req.body);
    } catch (error) {
        res.json(error);
    }
});

app.delete('/home/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Home.deleteOne({ _id: id });
        const data = await Home.find();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});