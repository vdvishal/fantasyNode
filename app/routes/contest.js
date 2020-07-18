const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/passport/isAuthenticate')


const contest = require('../controllers/contest')

const joinThirdContest = require('../controllers/joinThirdContest')

const joinUnderOverContest = require('../controllers/joinUnderOverContest')

const fantasyJoinContest = require('../controllers/fantasyJoinContest')


const { get,post } = contest


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/contest/:matchId`,get.get);

    app.get(`${process.env.BASE_URL}/contest/live/:matchId`,isAuth,get.getById);

    app.get(`${process.env.BASE_URL}/contest/user/:matchId`,get.getUserId); //isAuth,

    app.get(`${process.env.BASE_URL}/contest/matchUps/:matchId`,get.matchUps);

    app.get(`${process.env.BASE_URL}/contest/fantasy/:matchId`,get.getFantasyContest);


// POST --- > join, joinCustom, createCustom

    app.post(`${process.env.BASE_URL}/contest/join`,isAuth,post.join)

    app.post(`${process.env.BASE_URL}/contest/join/underover`,isAuth, joinUnderOverContest)

    app.post(`${process.env.BASE_URL}/contest/join/vs`,isAuth,post.joinVs)

    app.post(`${process.env.BASE_URL}/contest/join/matchup`,isAuth,joinThirdContest.post.post)

    app.post(`${process.env.BASE_URL}/contest/join/fantasy`,isAuth,fantasyJoinContest)


}

