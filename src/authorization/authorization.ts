import { ISecret } from "../configuration/secretConfiguration";
import { JwtPayload } from "jsonwebtoken";
import jwtConfiguration from "../configuration/jwtConfiguration";

export interface IAuthHandler {
    verify(token: string, secret: ISecret): JwtPayload;
    verify(secret: ISecret): (req: any, res: any, next: any) => void;
    sign(payload: any, secret: ISecret): string;
}

export class AuthHandler implements IAuthHandler {

    private static _instance: AuthHandler;

    private constructor() { }

    public static getInstance(): AuthHandler {
        if (!AuthHandler._instance) {
            AuthHandler._instance = new AuthHandler();
        }

        return AuthHandler._instance;
    }

    verify(token: string, secret: ISecret): JwtPayload;
    verify(secret: ISecret): (req: any, res: any, next: any) => void;
    verify(tokenOrSecret: any, secret?: any): any {
        if (typeof tokenOrSecret === 'string') {
            if (!secret) {
                throw new Error('Secret is required');
            }

            return jwtConfiguration.verify(tokenOrSecret, secret);
        } else {
            return (req: any, res: any, next: any) => {
                var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.auth;
                
                if (!token) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                
                try {
                    var data = jwtConfiguration.verify(token, tokenOrSecret);
                    
                    if (!data) {
                        res.status(401).send('Unauthorized');
                        return;
                    }

                    res.locals.data = data;
                    next();
                } catch (err) {
                    res.status(401).send('Unauthorized');
                }
            }
        }
    }
    
    sign(payload: any, secret: ISecret): string {
        return jwtConfiguration.sign(payload, secret);
    }

}