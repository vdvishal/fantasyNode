const fantasyPlayer = require('../controllers/fantasyPlayer')
const basicAuth = require('express-basic-auth')
const isAuth = require('../middlewares/jwt/auth')

const { get,post } = fantasyPlayer;

module.exports.setRouter = (app) => {
    // app.post(`${process.env.BASE_URL}/fantasyPlayer`,basicAuth({
    //     users: { 'app': 'qwewqinasdoinoinacino' }
    // }),post);

    app.get(`${process.env.BASE_URL}/fantasyPlayer`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.getPlayers);

    app.get(`${process.env.BASE_URL}/fantasyPlayer/team`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.getTeam);

    app.get(`${process.env.BASE_URL}/fantasyPlayer/:matchId/:playerId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.getSinglePlayer);

    app.get(`${process.env.BASE_URL}/player/history/:playerId`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),get.gethistorical);

    app.post(`${process.env.BASE_URL}/fantasyPlayer`,isAuth,post);
    
}

