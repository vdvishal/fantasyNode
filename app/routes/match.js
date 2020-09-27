const match = require('../controllers/match/get')
const patch = require('../controllers/match/patch')

const isAuth = require('../middlewares/jwt/auth')
const basicAuth = require('express-basic-auth')

const { getUpcoming,getByUserId } = match
 

module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/match/`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),getUpcoming);

    // get --> byUserId
    app.get(`${process.env.BASE_URL}/match/user`,isAuth,getByUserId);

    app.patch(`${process.env.BASE_URL}/match`,isAuth,patch.patch);

    app.patch(`${process.env.BASE_URL}/match/runout`,patch.runOut);

}

