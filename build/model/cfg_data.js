"use strict";

const mongoose = require('mongoose');

const usedSchema = new mongoose.Schema({
    recordTime: { 
        type: Date,
        default: Date.now
    },
    electric: { 
        type: String,
        required: true
    },
    water: {
        type: String,
        required: true
    },
    ePrice: {
        type: String,
        required: true
    },
    wPrice: {
        type: String,
        required: true
    }
});

const mainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    used: [usedSchema]
});

module.exports = mongoose.model("Home", mainSchema);
