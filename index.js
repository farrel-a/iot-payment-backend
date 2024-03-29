#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var mysql = require('mysql');
const mqtt = require('mqtt');

require('dotenv').config({path: `${__dirname}/.env`})
const mysql_host = process.env.MYSQL_HOST;
const mysql_user = process.env.MYSQL_USER;
const mysql_password = process.env.MYSQL_PASSWORD;
const mysql_database = process.env.MYSQL_DATABASE;
const mqtt_host = process.env.MQTT_HOST;
const PORT = process.env.PORT || 5000;

var pool = mysql.createPool({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
});

const mqtt_client = mqtt.connect(mqtt_host);
mqtt_client.on('connect', ()=> {
    mqtt_client.subscribe('/iot-payment/payment/log');
    console.log('MQTT broker connected');
});

mqtt_client.on('message', (topic, message) => {
    if (topic === '/iot-payment/payment/log') {
        const data = message.toString().split(',');
        const balance_change = data[0];
        const current_balance = data[1];
        pool.query('INSERT INTO payment_log (balance_change, current_balance) VALUES (?, ?)', 
                    [balance_change, current_balance],
                    (error, results) => {
                        if (error) {
                            console.log("Error inserting data to database")
                        }
                    }
        );
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.status(200).json({success: true, message: 'IoT Payment Service'});
});

app.get('/payment/log', (req, res) => {
    pool.query('SELECT * FROM payment_log', (error, results) => {
        if (error) {
            res.status(500).json({success: false});
        } else {
            res.status(200).json({success: true, data: results});
        }
    });
})

app.listen(PORT,"0.0.0.0", () => console.log(`IoT Payment API is running at 0.0.0.0:${PORT}`));