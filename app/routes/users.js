'use strict'  
const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/jwt/auth')
 const isRef = require('../middlewares/jwt/refToken')

const {get, post, patch} = require("./../controllers/users").account;
const {signUp,login,resetPassword,changePassword,logout,kyc,bank,withdraw} = post
const { profile, activateAccount,refToken,transaction} = get
const { patchProfile } = patch
 

const basicAuth = require('express-basic-auth')


module.exports.setRouter = (app) => {
    let baseUrl = `${process.env.BASE_URL}/users`;
    
    app.post(`${baseUrl}/signup`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }), signUp.validator,signUp.signUp);
 
    app.post(`${baseUrl}/login`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),login.validator, login.login)

    app.get(`${baseUrl}/profile`,isAuth,profile.profile)

    app.get(`${baseUrl}/refreshToken`,isRef,refToken.refreshToken)

    app.get(`${baseUrl}/transactions`,isAuth,profile.profile)

    app.get(`${process.env.BASE_URL}/payment/transaction`,isAuth,transaction);


    app.patch(`${baseUrl}/profile`,isAuth,patchProfile.patch)


    // Activate Profile

    app.get(`${baseUrl}/activate`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),activateAccount.activateUser)

    
    //reset && change password
    
    app.post(`${baseUrl}/sendCode`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),resetPassword.sendOTP)

    app.post(`${baseUrl}/verify`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),resetPassword.verifyOTP)

    app.post(`${baseUrl}/reset/password`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),resetPassword.resetPassword)

    app.patch(`${baseUrl}/password`,isAuth,changePassword.changePassword)

    //
    
    app.post(`${baseUrl}/logout`,isAuth,logout.logout)

    //KYC
    app.post(`${baseUrl}/kyc`,isAuth,kyc)

    app.post(`${baseUrl}/bank`,isAuth,bank)

    app.post(`${baseUrl}/withdraw`,isAuth,withdraw)

}