import express from 'express';

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Import configuration read from env
import { HttpConfiguration } from './configuration/httpServerConfiguration';

const app = express();
const port = HttpConfiguration.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
    }
);
