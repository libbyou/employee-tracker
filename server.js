const express = require('express');
// Import and require mysql2
const mysql = require('mysql');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'i4mdsdg4at5sdvt2',
    password: 'wbg0r5cn25cyb9s8',
    database: 'cvd6k2vjnp5om40d'
  },
  console.log(`Connected to the database.`)
);