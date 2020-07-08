'use strict'  
const express = require('express');
const router = express.Router();
const passport = require('passport');
const isAuth = require('../middlewares/jwt/auth')
const refreshToken = require('../middlewares/jwt/refToken')
const addOn = require('../middlewares/addOn')

const {get, post, patch} = require("./../controllers/users").account;
const {signUp,login,resetPassword,changePassword,logout} = post
const { profile, activateAccount,refToken} = get
const { patchProfile } = patch
// router.use(addOn)

module.exports.setRouter = (app) => {
    let baseUrl = `${process.env.BASE_URL}/users`;
    
    app.post(`${baseUrl}/signup`, signUp.validator,signUp.signUp);
 
    app.post(`${baseUrl}/login`,login.validator, login.login)

    app.get(`${baseUrl}/profile`,isAuth,profile.profile)

    app.get(`${baseUrl}/refreshToken`,refreshToken,refToken.refreshToken)

    app.get(`${baseUrl}/transactions`,isAuth,profile.profile)

 

    app.patch(`${baseUrl}/profile`,isAuth,patchProfile.patch)


    // Activate Profile

    app.get(`${baseUrl}/activate`,activateAccount.activateUser)

    
    //reset && change password
    
    app.post(`${baseUrl}/sendCode`,resetPassword.sendOTP)

    app.post(`${baseUrl}/verify`,resetPassword.verifyOTP)

    app.post(`${baseUrl}/reset/password`,resetPassword.resetPassword)

    app.post(`${baseUrl}/patch/password`,isAuth,changePassword.changePassword)

    //
    
    app.post(`${baseUrl}/logout`,isAuth,logout.logout)
}