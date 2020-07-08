const express = require('express');
const router = express.Router();

const contest = require('../controllers/contest')

const joinThirdContest = require('../controllers/joinThirdContest')

const { get,post } = contest


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/contest/:matchId`,get.get);

    app.get(`${process.env.BASE_URL}/contest/live/:matchId`,get.getById);

    app.get(`${process.env.BASE_URL}/contest/user`,get.getUserId);

    app.get(`${process.env.BASE_URL}/contest/matchUps/:matchId`,get.matchUps);

// POST --- > join, joinCustom, createCustom

    app.post(`${process.env.BASE_URL}/contest/join`,post.join)

    app.post(`${process.env.BASE_URL}/contest/join/custom`,post.joinCustom)

    app.post(`${process.env.BASE_URL}/contest/join/vs`,post.joinVs)

    app.post(`${process.env.BASE_URL}/contest/join/matchup`,joinThirdContest.post.post)

}

