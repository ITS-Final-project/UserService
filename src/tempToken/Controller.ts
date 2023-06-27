import { TempTokenService } from "./Service";
import { Router } from "express";
import { AuthHandler } from "../authorization/authorization";
import { USSecret } from "../configuration/secretConfiguration";
import { JwtPayload } from "jsonwebtoken";

const router = Router();

export class TempTokenController {
    private static _instance: TempTokenController;

    private _service: TempTokenService;
    private _authHandler: AuthHandler;

    private constructor() {
        this._service = TempTokenService.getInstance();
        this._authHandler = AuthHandler.getInstance();

        router.post('/create', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;

            if (!data) {
                res.status(400).send('UserId is required');
                return;
            }

            if (!data.user) {
                res.status(400).send('UserId is required');
                return;
            }

            this._service.createTempToken(data.user.id).then((tempToken) => {
                var token = this._authHandler.sign({ tempToken: tempToken }, new USSecret());
                res.status(200).json({ token: token });
            }).catch((err) => {
                res.status(400).send(err);
            });
        });

        router.post('/delete', async (req, res) => {
            var token = req.body.token;

            if (!token) {
                res.status(400).send('Token is required');
                return;
            }

            this._service.deleteTempToken(token).then((ack) => {
                res.status(200).json(ack);
            }).catch((err) => {
                res.status(400).send(err);
            });
        });

        // Open for other services to verify temp token
        router.post('/verify', async (req, res) => {
            var token = req.body.token;

            if (!token) {
                res.status(400).send('Token is required');
                return;
            }

            this._service.verifyTempToken(token).then((tempToken) => {
                res.status(200).json(tempToken);
            }).catch((err) => {
                res.status(400).send(err);
            });
        });
    }

    public static getInstance(): TempTokenController {
        if (!this._instance) {
            this._instance = new TempTokenController();
        }

        return this._instance;
    }

    public getRouter() {
        return router;
    }
}