import express from 'express';

import cookieParser from 'cookie-parser';
import { UserController } from './users/Controller';

// Import configuration read from env
import { HttpConfiguration } from './configuration/httpServerConfiguration';
import { SessionController } from './session/Controller';
import { TempTokenController } from './tempToken/Controller';

import { LogHandler } from './logging/logHandler';
import { LogController } from './logging/logController';

const logger = new LogHandler();
logger.open();

// MongoDD Sanitizer
const mondoDbSanitizer = require('express-mongo-sanitize');

const app = express();
const port = HttpConfiguration.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mondoDbSanitizer())

// Register controllers
const userController = UserController.getInstance();
const sessionController = SessionController.getInstance();
const tempTokenController = TempTokenController.getInstance();
const logController = LogController.getInstance();

app.use('/user', userController.getRouter());
app.use('/session', sessionController.getRouter());
app.use('/api/temp', tempTokenController.getRouter());
app.use('/logs', logController.getRouter());

app.get('/us/service/check', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send({status: 'OK'});
});

app.listen(port, () => {
    logger.info({
        origin: "HttpServer",
        action: "init",
        details: { serverType: "HttpServer", port: port },
      });
    console.log(`User service listening on port ${port}`);
    }
);
