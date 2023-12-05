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

app.get('/time', (req, res) => {
    const currentTime = new Date();
    const timeZone = 'Asia/Ho_Chi_Minh';
    const data = {
        time: formatTime(currentTime, timeZone),
        date: formatDate(currentTime, timeZone)
    };
    res.json(data);
});
function formatTime(date, timeZone) {
    return date.toLocaleString('en-US', { timeZone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatDate(date, timeZone) {
    return date.toLocaleString('en-US', { timeZone,day: '2-digit', month: '2-digit',year: '2-digit'}).replace(/\//g, '-');
}

app.get('/home/:phone/:pass', async (req, res) => {
    try {
        const phone = req.params.phone;
        const pass = req.params.pass;

        const data = await Home.find({
            phone: phone,
            pass: pass
        })

        res.json(data);
        
    } catch (error) {
        res.status(401).json({ error: 'Wrong password' });
    }
});

app.post('/add-account', async (req, res) => {
    try {
        const { name, phone, email, pass, used } = req.body;
        const data = new Home({ name, phone, email, pass, used });
        await data.save();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

app.post('/add-data/:id', async (req, res) => {
    try {
        const { electric, water, ePrice, wPrice } = req.body;
        const id = req.params.id;

        const home = await Home.findById(id);

        if (!home) {
            return res.status(404).json({ error: 'Không tìm thấy đối tượng Home' });
        }

        const newRecord = {
            recordTime: new Date(),
            electric,
            water,
            ePrice,
            wPrice
        };

        home.used.push(newRecord);

        await home.save();

        res.json({ message: 'Dữ liệu đã được cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        await Home.updateOne({ _id: req.params.id }, req.body);
        res.json(req.body);
    } catch (error) {
        res.json(error);
    }
});

app.delete('/remove/:id', async (req, res) => {
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
