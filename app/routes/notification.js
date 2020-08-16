const notification = require('../controllers/notification/index')

const isAuth = require('../middlewares/jwt/auth')


module.exports.setRouter = (app) => {
    // get --> byUserId
    app.get(`${process.env.BASE_URL}/user/notification`,isAuth,notification.get);

}
