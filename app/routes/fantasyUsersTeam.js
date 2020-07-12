const fantasyUsersTeam = require('../controllers/fantasyUsersTeam')

const { get,post } = fantasyUsersTeam;
const { patch } = fantasyUsersTeam;
module.exports.setRouter = (app) => {

    
    //pos
    app.post(`${process.env.BASE_URL}/team/user/`,post);
    
    app.get(`${process.env.BASE_URL}/team/user/all/:matchId`,get.getPlayersByUserId);

    app.get(`${process.env.BASE_URL}/team/user/:matchId/:teamId`,get.getTeamById);

    app.patch(`${process.env.BASE_URL}/team/user/:teamId`,patch);
}

