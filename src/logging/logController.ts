import { AuthHandler } from "../authorization/authorization";
import { LogHandler } from "./logHandler";

import express from 'express';
import { LogService } from "./logService";
import { USSecret } from "../configuration/secretConfiguration";

var router = express.Router();

const logHandler = new LogHandler();

export class LogController {
    private _service: LogService;
    private _authHandler: AuthHandler;
    private static _instance: LogController;


    public static getInstance(): LogController {
        if (!LogController._instance) {
            LogController._instance = new LogController();
        }

        return LogController._instance;
    }

    private constructor() {

        this._service = LogService.getInstance();
        this._authHandler = AuthHandler.getInstance();

        router.get('/list', this._authHandler.verify(new USSecret()), async (req, res) => {
            // Returns a list of all log files
            var data = await this._service.getLogFiles();

            console.log(data);

            res.status(200).send({result: data});
        });

        router.post('/get', async (req, res) => {
            // Returns a list of all log files
            var data = await this._service.getLogValueByFilter(req.body.name as any, req.body.filter);

            console.log("DaTA:" + data);

            res.status(200).send({result: data});
         });
    }

    public getRouter() {
        return router;
    }
    
}