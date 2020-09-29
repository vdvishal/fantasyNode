const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/jwt/auth')
const basicAuth = require('express-basic-auth')


const contest = require('../controllers/contest')

 


const { get, post } = contest


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/contest/:matchId`, basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }), get.get);

    app.get(`${process.env.BASE_URL}/contest/live/:matchId`, isAuth, get.getById);

    app.get(`${process.env.BASE_URL}/contest/user/:matchId`, isAuth, get.getUserId); //isAuth,

    app.get(`${process.env.BASE_URL}/contest/count/:matchId`, isAuth, get.getCount); //isAuth,



    app.get(`${process.env.BASE_URL}/contest/matchUps/:matchId`, basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }), get.matchUps);

    app.get(`${process.env.BASE_URL}/contest/fantasy/:matchId`, basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }), get.getFantasyContest);

    app.get(`${process.env.BASE_URL}/contest/details/:matchId/:contestId`, isAuth, get.getById);

    app.get(`${process.env.BASE_URL}/contest/leaderboard/:contestId`, isAuth, get.leaderBoard);

    app.get(`${process.env.BASE_URL}/contest/custom/:matchId`, basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }), get.getCustom);


    // POST --- > join, joinCustom, createCustom


    app.post(`${process.env.BASE_URL}/contest/count`, isAuth, post.count);

    app.post(`${process.env.BASE_URL}/contest`, post.create);

    // detele 

    app.delete(`${process.env.BASE_URL}/contest`, isAuth, contest.deleteContest)
}

