'use strict';

require("dotenv").config;
const functions = require('firebase-functions');
const express = require('express');
const https = require("https");
const app = express();

const cors = require("cors");
app.use(cors({origin: true}));
app.use(express.json());

const DARK_SKY_API_KEY = functions.config().darksky;
console.log("API key", DARK_SKY_API_KEY);
console.log(functions.config().darksky);

app.get("/", (req, res) => {
    res.status(200).send("Request to root");
})

app.get("/showtime", (req, res) => {
    //Getting weather for todays date...
    const date = new Date();
    const year = date.getFullYear().toString();
    //Month is 0-indexed
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    //Make sure single digit values have a leading '0'
    if (month.length < 2) {
        month = `0${month}`;
    }
    if (day.length < 2) {
        day = `0${day}`;
    }
    //...at this time
    const hr = "19";
    const min = "00";
    const sec = "00";
    //Insert date and time into request url (not hard-coding in so it can be flexible)
    const SHOWTIME_WEATHER_URL = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/37.8092,-85.4669,${year}-${month}-${day}T${hr}%3A${min}%3A${sec}`;
    let initialData = "";
    console.log(SHOWTIME_WEATHER_URL);
    const promise = new Promise((resolve, reject) => {
        const request = https.get(SHOWTIME_WEATHER_URL, response => {
            response.on("data", data => {
                console.log("Hello there");
                initialData += data;
            })
            response.on("end", resolve);
        });
        request.on("error", reject);
    });
    promise.then(() => {
        console.log("General Kenobi");
        res.status(200).send(initialData);
    }).catch(err => {
        res.status(500).send("Error");
    })
    // res.status(200).send("Request for showtime weather");
});

app.get("/current", (req, res) => {
    const CURRENT_WEATHER_URL = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/37.8092,-85.4669`;
    let initialData = "";
    const promise = new Promise((resolve, reject) => {
        const request = https.get(CURRENT_WEATHER_URL, response => {
            response.on("data", data => {
                initialData += data;
            })
            response.on("end", resolve);
        })
        request.on("error", reject);
    })
    promise.then(() => {
        res.status(200).send(initialData);
    }).catch(err => {
        res.status(500).send("Error");
    })
   
})

exports.api = functions.https.onRequest(app);



