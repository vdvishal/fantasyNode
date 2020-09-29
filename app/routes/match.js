const match = require('../controllers/match/get')
const patch = require('../controllers/match/patch')
const post = require('../controllers/match/post/post')

const refund = require('../controllers/refund')

const isAuth = require('../middlewares/jwt/auth')
const basicAuth = require('express-basic-auth')

const { getUpcoming,getByUserId,completed } = match
 

module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/match/`,basicAuth({
        users: { 'app': 'qwewqinasdoinoinacino' }
    }),getUpcoming);

    // get --> byUserId
    app.get(`${process.env.BASE_URL}/match/user`,isAuth,getByUserId);

    app.get(`${process.env.BASE_URL}/match/completed`,isAuth,completed);
    
    app.post(`${process.env.BASE_URL}/match`,isAuth,post);
    
    app.post(`${process.env.BASE_URL}/refund`,isAuth,refund);


    app.patch(`${process.env.BASE_URL}/match`,isAuth,patch.patch);

    app.patch(`${process.env.BASE_URL}/match/runout`,isAuth,patch.runOut);
    
}

