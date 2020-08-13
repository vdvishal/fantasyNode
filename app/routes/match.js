const match = require('../controllers/match/get')
const isAuth = require('../middlewares/jwt/auth')
const basicAuth = require('express-basic-auth')

const { getUpcoming,getByUserId } = match


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/match/`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),getUpcoming);

    // get --> byUserId
    app.get(`${process.env.BASE_URL}/match/user`,isAuth,getByUserId);

}

