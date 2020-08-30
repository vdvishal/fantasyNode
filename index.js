const express = require('express');
const mongoose = require('mongoose');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
require('dotenv').config({ path: './.env' })

const Sentry = require('@sentry/node');
const statusMonitor = require('express-status-monitor')();

 
const helmet = require('helmet')

// const redisClient = require('./app/libraries/redis/redis');
 

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const i18n = require("i18n");
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const logger = require('winston')

const fs = require('fs');
const path = require('path');

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const passport = require('passport');
const fork = require('child_process').fork;





// const mqtt = require('./app/libraries/mqtt')

const log = console.log;

const options = {
    directory: './i18n', // <--- use here. Specify translations files path.
    locales: ["en","es"],
    autoReload: true,
}
const models = './app/models';
const routes = './app/routes';

const app = express();



app.use(statusMonitor);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



 
// app.use(session({
//     secret: 'secret',
//     // create new redis store.
//     store: new redisStore({ host: process.env.REDIS_IP, port: 6379, client: redisClient,ttl :  260}),
//     cookie: { secure: false }, 
//     saveUninitialized: false,
//     resave: false
// }));

i18n.configure(options);

// app.use(i18n.init);

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
    next();
});

app.use(morgan("dev"))



 
app.use(require('express-status-monitor')())
//Custom middleware
Sentry.init({ dsn: 'https://7315e837b57b48999d9654123e111005@o431193.ingest.sentry.io/5381542' });
app.use(Sentry.Handlers.requestHandler());

 
fs.readdirSync(models).forEach(function (file) {
    if (~file.indexOf('.js')) require(models + '/' + file)
});

fs.readdirSync(routes).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routes + '/' + file);
        route.setRouter(app);
    }
});




const server = http.createServer(app);
server.listen(process.env.PORT);
server.on('error', onError);
server.on('listening', onListening);
 
 

// redisClient.on('error',  (error) => {
//     log(`${chalk.greenBright(logSymbols.error)} ${chalk.red(error)}`);
// })

// redisClient.on('connect', () => {
//     log(`${chalk.greenBright(logSymbols.success)} Redis connected`);
// })


// mqtt.publish("/globalStats","connecte",{},{})

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error;
    }


    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error;
    }
}

function onListening() {

    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind);
     
    log(`${chalk.greenBright(logSymbols.success)} server listening on port ${addr.port}`);
    //  logger.info('server listening on port ' + addr.port, 'serverOnListeningHandler', 10);
    // DB connection 
     mongoose.connect(process.env.DB_HOST,{useNewUrlParser: true, useUnifiedTopology: true });
    
    // redis connection

    // redisClient.on('connect', () => {
    //     logger.info("connected")
    // })
}

/**
 * database connection settings
 */
mongoose.connection.on('error', function (err) {
    console.log('database connection error');
  }); // end mongoose connection error
  
  mongoose.connection.on('open', function (err) {
    if (err) {
      logger.error(err, 'mongoose connection open handler', 10)
    } else {
       log(`${chalk.greenBright(logSymbols.success)} ${chalk.green("Database connection open")}`);
    }
    //process.exit(1)
  }); 
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

//console.log(process.env)
module.exports = app;
