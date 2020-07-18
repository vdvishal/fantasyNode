const match = require('../controllers/match/get')
const isAuth = require('../middlewares/passport/isAuthenticate')

const { getUpcoming,getByUserId } = match


module.exports.setRouter = (app) => {
    app.get(`${process.env.BASE_URL}/match/`,getUpcoming);

    // get --> byUserId
    app.get(`${process.env.BASE_URL}/match/user`,isAuth,getByUserId);

}

