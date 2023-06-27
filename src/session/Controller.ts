import { USSecret } from '../configuration/secretConfiguration';

import express from 'express';
import { AuthHandler } from '../authorization/authorization';
import { SessionService } from './Service';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

export class SessionController {
    private static _instance: SessionController;

    private _authHandler: AuthHandler;
    private _service: SessionService;

    private constructor() {
        this._service = SessionService.getInstance();
        this._authHandler = AuthHandler.getInstance();

        router.post('/verify', this._authHandler.verify(new USSecret()), (req, res) => {
            var data = res.locals.data as JwtPayload;
            this._service.verifySession(data).then((session) => {
                var token = this._authHandler.sign({ session: session }, new USSecret());
                res.status(200).json({token: token});
            }).catch((err) => {
                res.status(400).json(err);
            });
        });
    }

    public getRouter() {
        return router;
    }

    public static getInstance(): SessionController {
        if (!this._instance) {
            this._instance = new SessionController();
        }

        return this._instance;
    }

}