const fantasyPlayer = require('../controllers/fantasyPlayer')

const { get,post } = fantasyPlayer;

module.exports.setRouter = (app) => {
    app.post(`${process.env.BASE_URL}/fantasyPlayer`,post);

    app.get(`${process.env.BASE_URL}/fantasyPlayer`,get.getPlayers);

    app.get(`${process.env.BASE_URL}/fantasyPlayer/team`,get.getTeam);

}

