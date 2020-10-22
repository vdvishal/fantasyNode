'use strict'  
const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/jwt/auth')
 const isRef = require('../middlewares/jwt/refToken')
 
const image = require('../controllers/uploadImage/uploadImage')

var multer  = require('multer')
var storage = multer.diskStorage(
    {
        destination: '/var/www/html/images/',
        filename: function ( req, file, cb ) {
            cb( null, Date.now() + '.' + file.mimetype.split('/')[1]);
        }
    }
);

let upload = multer({ storage: storage });
let baseUrl = `${process.env.BASE_URL}/image`;


module.exports.setRouter = (app) => {
    app.post(`${baseUrl}/upload`,upload.single('image'),isAuth,image)
}
