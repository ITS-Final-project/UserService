import express from 'express';

import cookieParser from 'cookie-parser';
import { UserController } from './users/Controller';

// Import configuration read from env
import { HttpConfiguration } from './configuration/httpServerConfiguration';

// MongoDD Sanitizer
const mondoDbSanitizer = require('express-mongo-sanitize');

const app = express();
const port = HttpConfiguration.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mondoDbSanitizer())

const userController = UserController.getInstance();

app.use('/user', userController.getRouter());

app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
    }
);
