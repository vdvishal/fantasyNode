const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/jwt/auth')
const basicAuth = require('express-basic-auth')


const contest = require('../controllers/contest')

const joinThirdContest = require('../controllers/joinThirdContest')

const joinUnderOverContest = require('../controllers/joinUnderOverContest')

const fantasyJoinContest = require('../controllers/fantasyJoinContest')

const fantasypatchContest = require('../controllers/fantasyJoinContest/patch')


const { get,post } = contest


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/contest/:matchId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.get);

    app.get(`${process.env.BASE_URL}/contest/live/:matchId`,isAuth,get.getById);

    app.get(`${process.env.BASE_URL}/contest/user/:matchId`,isAuth,get.getUserId); //isAuth,

    app.get(`${process.env.BASE_URL}/contest/count/:matchId`,isAuth,get.getCount); //isAuth,

    

    app.get(`${process.env.BASE_URL}/contest/matchUps/:matchId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.matchUps);

    app.get(`${process.env.BASE_URL}/contest/fantasy/:matchId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.getFantasyContest);

    app.get(`${process.env.BASE_URL}/contest/details/:matchId/:contestId`,isAuth,get.getById);

    app.get(`${process.env.BASE_URL}/contest/leaderboard/:contestId`,isAuth,get.leaderBoard);

    app.get(`${process.env.BASE_URL}/contest/custom/:matchId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.getCustom);

    
// POST --- > join, joinCustom, createCustom

    app.post(`${process.env.BASE_URL}/contest/join`,isAuth,post.join)

    app.post(`${process.env.BASE_URL}/contest/join/underover`,isAuth, joinUnderOverContest)

    app.post(`${process.env.BASE_URL}/contest/join/vs`,isAuth,post.joinVs)

    app.post(`${process.env.BASE_URL}/contest/join/matchup`,isAuth,joinThirdContest.post.post)

    app.post(`${process.env.BASE_URL}/contest/join/fantasy`,isAuth,fantasyJoinContest)

    app.patch(`${process.env.BASE_URL}/contest/patch/fantasy`,isAuth,fantasypatchContest)

    app.post(`${process.env.BASE_URL}/contest/custom`,post.createCustom.validator,isAuth,post.createCustom.custom)

    app.patch(`${process.env.BASE_URL}/contest/join/custom`,isAuth,post.joinCustom)


    // detele 

    app.delete(`${process.env.BASE_URL}/contest`,isAuth,contest.deleteContest)
}

